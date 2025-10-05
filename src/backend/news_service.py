import httpx
import asyncio
from typing import List, Dict, Optional
from config import NEWS_API_BASE_URL, NEWS_API_KEY, NEWS_HEADERS
import re

class NewsService:
    def __init__(self):
        self.base_url = NEWS_API_BASE_URL
        self.headers = NEWS_HEADERS
        self._cache = {}  # Simple in-memory cache
        self._cache_ttl = 300  # 5 minutes cache TTL
    
    def _get_cache_key(self, method: str, **kwargs) -> str:
        """Generate cache key for method and parameters"""
        return f"{method}:{':'.join(f'{k}={v}' for k, v in sorted(kwargs.items()))}"
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cache entry is still valid"""
        if cache_key not in self._cache:
            return False
        import time
        return time.time() - self._cache[cache_key]['timestamp'] < self._cache_ttl
    
    def _get_from_cache(self, cache_key: str):
        """Get data from cache if valid"""
        if self._is_cache_valid(cache_key):
            return self._cache[cache_key]['data']
        return None
    
    def _set_cache(self, cache_key: str, data):
        """Set data in cache with timestamp"""
        import time
        self._cache[cache_key] = {
            'data': data,
            'timestamp': time.time()
        }
    
    def _is_film_related(self, title: str, description: str) -> bool:
        """Check if news article is film-related"""
        film_keywords = [
            'movie', 'film', 'cinema', 'hollywood', 'bollywood', 'actor', 'actress', 
            'director', 'producer', 'screenplay', 'box office', 'premiere', 'trailer',
            'sequel', 'remake', 'oscar', 'award', 'festival', 'netflix', 'disney',
            'marvel', 'dc', 'superhero', 'blockbuster', 'theater', 'streaming',
            'release', 'casting', 'production', 'studio', 'entertainment'
        ]
        
        text = f"{title} {description}".lower()
        return any(keyword in text for keyword in film_keywords)
    
    async def get_film_news(self, query: str = "movies", language: str = "en", page_size: int = 20) -> List[Dict]:
        """Get film-related news articles"""
        # Check cache first
        cache_key = self._get_cache_key("film_news", query=query, language=language, page_size=page_size)
        cached_result = self._get_from_cache(cache_key)
        if cached_result is not None:
            return cached_result
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                # Try multiple search strategies for film news
                search_queries = [
                    f"{query} movie film cinema",
                    f"{query} hollywood bollywood",
                    f"{query} entertainment",
                    f"{query} actor actress director"
                ]
                
                all_articles = []
                
                for search_query in search_queries:
                    try:
                        url = f"{self.base_url}/everything"
                        params = {
                            "apiKey": NEWS_API_KEY,
                            "q": search_query,
                            "language": language,
                            "sortBy": "publishedAt",
                            "pageSize": min(page_size, 100),  # NewsAPI limit
                            "page": 1
                        }
                        
                        response = await client.get(url, headers=self.headers, params=params)
                        response.raise_for_status()
                        data = response.json()
                        
                        articles = data.get("articles", [])
                        
                        # Filter for film-related articles
                        film_articles = [
                            article for article in articles 
                            if self._is_film_related(
                                article.get("title", ""), 
                                article.get("description", "")
                            )
                        ]
                        
                        all_articles.extend(film_articles)
                        
                        # If we have enough articles, break
                        if len(all_articles) >= page_size:
                            break
                            
                    except Exception as e:
                        print(f"Error fetching news for query '{search_query}': {e}")
                        continue
                
                # Remove duplicates based on title
                seen_titles = set()
                unique_articles = []
                for article in all_articles:
                    title = article.get("title", "")
                    if title and title not in seen_titles:
                        seen_titles.add(title)
                        unique_articles.append(article)
                
                # Limit to requested page size
                result = unique_articles[:page_size]
                
                # Cache the result
                self._set_cache(cache_key, result)
                return result
                
        except Exception as e:
            print(f"Error fetching film news: {e}")
            return []
    
    async def search_film_news(self, query: str, language: str = "en", page_size: int = 20) -> List[Dict]:
        """Search for specific film-related news"""
        if not query or not query.strip():
            return await self.get_film_news("movies", language, page_size)
        
        # Check cache first
        cache_key = self._get_cache_key("search_film_news", query=query.lower().strip(), language=language, page_size=page_size)
        cached_result = self._get_from_cache(cache_key)
        if cached_result is not None:
            return cached_result
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                url = f"{self.base_url}/everything"
                params = {
                    "apiKey": NEWS_API_KEY,
                    "q": f"{query} movie film cinema entertainment",
                    "language": language,
                    "sortBy": "publishedAt",
                    "pageSize": min(page_size, 100),
                    "page": 1
                }
                
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                articles = data.get("articles", [])
                
                # Filter for film-related articles
                film_articles = [
                    article for article in articles 
                    if self._is_film_related(
                        article.get("title", ""), 
                        article.get("description", "")
                    )
                ]
                
                # Cache the result
                self._set_cache(cache_key, film_articles)
                return film_articles
                
        except Exception as e:
            print(f"Error searching film news: {e}")
            return []
    
    def format_news_for_response(self, article: Dict) -> Dict:
        """Format news article for API response"""
        return {
            "title": article.get("title", ""),
            "description": article.get("description", ""),
            "url": article.get("url", ""),
            "urlToImage": article.get("urlToImage"),
            "publishedAt": article.get("publishedAt", ""),
            "source": article.get("source", {}).get("name", ""),
            "author": article.get("author", ""),
            "content": article.get("content", "")
        }
