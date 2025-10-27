import httpx
import json
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
import random

from config import TMDB_API_KEY
from social_analysis_service import Post, Thread

class TMDBService:
    """Service for fetching movie reviews from TMDB API"""
    
    def __init__(self):
        self.api_key = TMDB_API_KEY
        self.base_url = "https://api.themoviedb.org/3"
        
    async def search_movie(self, query: str) -> Optional[Dict[str, Any]]:
        """Search for a movie by title"""
        url = f"{self.base_url}/search/movie"
        params = {
            "api_key": self.api_key,
            "query": query,
            "language": "en-US",
            "page": 1,
            "include_adult": False
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                if data["results"] and len(data["results"]) > 0:
                    return data["results"][0]  # Return the first movie result
                return None
            except Exception as e:
                print(f"Error searching for movie: {e}")
                return None
    
    async def get_movie_reviews(self, movie_id: int) -> List[Dict[str, Any]]:
        """Get reviews for a movie by its ID"""
        url = f"{self.base_url}/movie/{movie_id}/reviews"
        params = {
            "api_key": self.api_key,
            "language": "en-US",
            "page": 1
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                return data.get("results", [])
            except Exception as e:
                print(f"Error getting movie reviews: {e}")
                return []
    
    def convert_to_posts(self, reviews: List[Dict[str, Any]], movie_title: str) -> List[Post]:
        """Convert TMDB reviews to Post objects"""
        posts = []
        
        for review in reviews:
            # Analyze sentiment based on rating if available
            rating = None
            if "author_details" in review and "rating" in review["author_details"]:
                rating = review["author_details"]["rating"]
            
            sentiment = "neutral"
            if rating:
                if rating >= 7:
                    sentiment = "positive"
                elif rating <= 4:
                    sentiment = "negative"
            
            # Create a Post object
            post = Post(
                id=review["id"],
                content=review["content"][:500],  # Limit content length
                platform="TMDB",
                timestamp=review["created_at"],
                author=review["author"],
                movie_mentioned=movie_title,
                sentiment=sentiment
            )
            posts.append(post)
        
        return posts
    
    async def get_movie_social_analysis(self, movie_title: str) -> Optional[Thread]:
        """Get social media analysis for a movie using TMDB reviews"""
        # Search for the movie
        movie = await self.search_movie(movie_title)
        if not movie:
            return None
        
        # Get reviews for the movie
        reviews = await self.get_movie_reviews(movie["id"])
        if not reviews:
            return self._generate_fallback_thread(movie_title)
        
        # Convert reviews to posts
        posts = self.convert_to_posts(reviews, movie["title"])
        
        # Create a thread from the posts
        from social_analysis_service import SocialAnalysisService
        social_service = SocialAnalysisService()
        thread = social_service.analyze_thread(posts)
        
        return thread
    
    def _generate_fallback_thread(self, movie_title: str) -> Thread:
        """Generate a fallback thread when no reviews are found"""
        # Create a thread with a message about no reviews
        thread = Thread(
            id=f"tmdb-{random.randint(1000, 9999)}",
            title=f"TMDB Reviews for {movie_title}",
            platform="TMDB",
            sentiment="neutral",
            summary=f"No reviews found for {movie_title} on TMDB.",
            posts=[]
        )
        
        # Add a single post explaining the situation
        post = Post(
            id=f"fallback-{random.randint(1000, 9999)}",
            content=f"We couldn't find any reviews for {movie_title} on TMDB. This could be because the movie is very new, not widely reviewed, or there might be an issue with our connection to TMDB.",
            platform="TMDB",
            timestamp=datetime.now().isoformat(),
            author="CineLenz System",
            movie_mentioned=movie_title,
            sentiment="neutral"
        )
        
        thread.posts = [post]
        return thread