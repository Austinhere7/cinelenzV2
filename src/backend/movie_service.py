import httpx
import asyncio
from typing import List, Dict, Optional
from config import TMDB_BASE_URL, TMDB_HEADERS, TMDB_API_KEY

class MovieService:
    def __init__(self):
        self.base_url = TMDB_BASE_URL
        self.headers = TMDB_HEADERS
        self._cache = {}  # Simple in-memory cache
        self._cache_ttl = 300  # 5 minutes cache TTL
    
    async def get_trending_movies(self, time_window: str = "week", language: str = "en-US") -> List[Dict]:
        """Get trending movies from TMDB with caching"""
        # Check cache first
        cache_key = self._get_cache_key("trending", time_window=time_window, language=language)
        cached_result = self._get_from_cache(cache_key)
        if cached_result is not None:
            return cached_result
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"{self.base_url}/trending/movie/{time_window}"
                params = {
                    "api_key": TMDB_API_KEY,
                    "language": language
                }
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                data = response.json()
                results = data.get("results", [])
                
                # Cache the result
                self._set_cache(cache_key, results)
                return results
        except Exception as e:
            print(f"Error fetching trending movies: {e}")
            import traceback
            traceback.print_exc()
            # Return empty list instead of None to prevent frontend errors
            return []
    
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

    async def search_movies(self, query: str, language: str = "en-US") -> List[Dict]:
        """Search for movies by title with improved error handling and fallbacks"""
        if not query or not query.strip():
            return []
        
        # Check cache first
        cache_key = self._get_cache_key("search", query=query.lower().strip(), language=language)
        cached_result = self._get_from_cache(cache_key)
        if cached_result is not None:
            return cached_result
        
        # Try multiple search strategies
        search_strategies = [
            # Strategy 1: Exact search
            {"query": query.strip(), "include_adult": False},
            # Strategy 2: Search with year if present
            {"query": query.strip(), "include_adult": False, "year": None},
            # Strategy 3: Partial search
            {"query": query.strip().split()[0] if query.strip().split() else query.strip(), "include_adult": False},
        ]
        
        for i, params in enumerate(search_strategies):
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    url = f"{self.base_url}/search/movie"
                    search_params = {
                        "api_key": TMDB_API_KEY,
                        "language": language,
                        **params
                    }
                    
                    response = await client.get(url, headers=self.headers, params=search_params)
                    response.raise_for_status()
                    data = response.json()
                    results = data.get("results", [])
                    
                    if results:
                        # Cache the successful result
                        self._set_cache(cache_key, results)
                        return results
                        
            except Exception as e:
                print(f"Search strategy {i+1} failed for '{query}': {e}")
                continue
        
        # If all strategies fail, try to get popular movies as fallback
        try:
            print(f"All search strategies failed for '{query}', returning popular movies as fallback")
            popular_movies = await self.get_trending_movies("week", language)
            return popular_movies[:8]  # Return first 8 popular movies
        except Exception as e:
            print(f"Fallback also failed: {e}")
            return []
    
    async def get_movie_details(self, movie_id: int, language: str = "en-US") -> Optional[Dict]:
        """Get detailed information about a specific movie"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/movie/{movie_id}"
                params = {
                    "api_key": TMDB_API_KEY,
                    "language": language
                }
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Error fetching movie details: {e}")
            return None
    
    async def get_upcoming_movies(self, language: str = "en-US", page: int = 1) -> List[Dict]:
        """Get upcoming movies with caching"""
        # Check cache first
        cache_key = self._get_cache_key("upcoming", language=language, page=page)
        cached_result = self._get_from_cache(cache_key)
        if cached_result is not None:
            return cached_result
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"{self.base_url}/movie/upcoming"
                params = {
                    "api_key": TMDB_API_KEY,
                    "language": language,
                    "page": page
                }
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                data = response.json()
                results = data.get("results", [])
                
                # Cache the result
                self._set_cache(cache_key, results)
                return results
        except Exception as e:
            print(f"Error fetching upcoming movies: {e}")
            return []
    
    async def get_now_playing_movies(self, language: str = "en-US", page: int = 1) -> List[Dict]:
        """Get movies currently playing in theaters"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/movie/now_playing"
                params = {
                    "api_key": TMDB_API_KEY,
                    "language": language,
                    "page": page
                }
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                data = response.json()
                return data.get("results", [])
        except Exception as e:
            print(f"Error fetching now playing movies: {e}")
            return []
    
    async def get_movie_videos(self, movie_id: int, language: str = "en-US") -> List[Dict]:
        """Get videos (trailers, teasers, clips) for a specific movie"""
        # Check cache first
        cache_key = self._get_cache_key("videos", movie_id=movie_id, language=language)
        cached_result = self._get_from_cache(cache_key)
        if cached_result is not None:
            return cached_result
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = f"{self.base_url}/movie/{movie_id}/videos"
                params = {
                    "api_key": TMDB_API_KEY,
                    "language": language
                }
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                data = response.json()
                results = data.get("results", [])
                
                # Filter for YouTube videos and trailers/teasers
                filtered_videos = [
                    video for video in results 
                    if video.get("site") == "YouTube" and 
                    video.get("type") in ["Trailer", "Teaser", "Clip"]
                ]
                
                # Cache the result
                self._set_cache(cache_key, filtered_videos)
                return filtered_videos
        except Exception as e:
            print(f"Error fetching movie videos: {e}")
            return []
    
    def format_movie_for_response(self, movie: Dict) -> Dict:
        """Format movie data for API response"""
        return {
            "id": movie.get("id"),
            "title": movie.get("title"),
            "overview": movie.get("overview"),
            "poster_path": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get('poster_path') else None,
            "backdrop_path": f"https://image.tmdb.org/t/p/w1280{movie.get('backdrop_path')}" if movie.get('backdrop_path') else None,
            "release_date": movie.get("release_date"),
            "vote_average": movie.get("vote_average"),
            "vote_count": movie.get("vote_count"),
            "popularity": movie.get("popularity"),
            "genre_ids": movie.get("genre_ids", []),
            "adult": movie.get("adult", False),
            "original_language": movie.get("original_language"),
            "original_title": movie.get("original_title")
        }
