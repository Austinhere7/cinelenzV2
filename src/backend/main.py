from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, Optional, List, Dict, Any
import httpx
from movie_service import MovieService
from news_service import NewsService
from social_analysis_service import SocialAnalysisService
from real_social_service import RealSocialMediaService
from tmdb_service import TMDBService
from config import TMDB_API_KEY, TMDB_BASE_URL, TMDB_HEADERS

app = FastAPI(title="CineLenz API")

# Allow local frontend calls; tighten for production as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
movie_service = MovieService()
news_service = NewsService()
social_service = SocialAnalysisService()
real_social_service = RealSocialMediaService()
tmdb_service = TMDBService()

Range = Literal["24h", "week", "month"]
Lang = Literal["en", "hi", "ta", "te", "es"]

class AnalyzeRequest(BaseModel):
    movie: str
    time_range: Range
    language: Optional[Lang] = "en"

class AnalyzeResponse(BaseModel):
    ok: bool
    summary: str
    threads: int
    sample_topics: list[str]
    movie_data: Optional[Dict] = None

class TrendingResponse(BaseModel):
    movies: List[Dict]

class MovieSearchResponse(BaseModel):
    movies: List[Dict]
    total_results: int
    page: int

class MovieDetailsResponse(BaseModel):
    movie: Dict
    
# New proxy endpoints for TMDB API
@app.get("/api/tmdb/trending/{media_type}/{time_window}")
async def get_trending(media_type: str, time_window: str, language: str = "en"):
    """Proxy endpoint for TMDB trending API"""
    try:
        url = f"{TMDB_BASE_URL}/trending/{media_type}/{time_window}"
        params = {"language": language, "api_key": TMDB_API_KEY}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=TMDB_HEADERS)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trending data: {str(e)}")

@app.get("/api/tmdb/search/movie")
async def search_movies(query: str, language: str = "en", page: int = 1):
    """Proxy endpoint for TMDB movie search API"""
    try:
        url = f"{TMDB_BASE_URL}/search/movie"
        params = {"query": query, "language": language, "page": page, "api_key": TMDB_API_KEY}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=TMDB_HEADERS)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error searching movies: {str(e)}")

@app.get("/api/tmdb/movie/{movie_id}")
async def get_movie_details(movie_id: int, language: str = "en"):
    """Proxy endpoint for TMDB movie details API"""
    try:
        url = f"{TMDB_BASE_URL}/movie/{movie_id}"
        params = {"language": language, "api_key": TMDB_API_KEY}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=TMDB_HEADERS)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie details: {str(e)}")

class NewsArticle(BaseModel):
    title: str
    description: str
    url: str
    urlToImage: Optional[str] = None
    
@app.get("/analyze/social")
async def analyze_social_media(movie: str):
    """Analyze social media posts for a specific movie using TMDB reviews"""
    try:
        # Use the TMDB service to get movie reviews
        thread = await tmdb_service.get_movie_social_analysis(movie)
        
        if not thread:
            # Fallback to sample data if TMDB fails
            posts = social_service.load_posts("src/backend/sample_posts.json")
            movie_posts = social_service.filter_posts_by_movie(posts, movie)
            
            if movie_posts:
                thread = social_service.analyze_thread(movie_posts)
            else:
                raise HTTPException(status_code=404, detail=f"No social media posts found for movie: {movie}")
        
        # Return the thread data
        return {"threads": [thread.__dict__]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing social media: {str(e)}")
    publishedAt: str
    source: str
    author: Optional[str] = None
    content: Optional[str] = None

class NewsResponse(BaseModel):
    articles: List[NewsArticle]
    total_results: int

# Movie endpoints
@app.get("/trending", response_model=TrendingResponse)
async def get_trending_movies(time_range: Range = "week", lang: Lang = "en"):
    """Get trending movies"""
    try:
        movies = await movie_service.get_trending_movies(time_range, f"{lang}-US")
        formatted_movies = [movie_service.format_movie_for_response(movie) for movie in movies]
        return TrendingResponse(movies=formatted_movies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trending movies: {str(e)}")

@app.get("/search", response_model=MovieSearchResponse)
async def search_movies(query: str, lang: Lang = "en", page: int = 1):
    """Search for movies by title"""
    try:
        movies = await movie_service.search_movies(query, f"{lang}-US")
        formatted_movies = [movie_service.format_movie_for_response(movie) for movie in movies]
        return MovieSearchResponse(
            movies=formatted_movies,
            total_results=len(movies),
            page=page
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching movies: {str(e)}")

@app.get("/movie/{movie_id}", response_model=MovieDetailsResponse)
async def get_movie_details(movie_id: int, lang: Lang = "en"):
    """Get detailed information about a specific movie"""
    try:
        movie = await movie_service.get_movie_details(movie_id, f"{lang}-US")
        formatted_movie = movie_service.format_movie_for_response(movie)
        return MovieDetailsResponse(movie=formatted_movie)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie details: {str(e)}")

@app.get("/upcoming", response_model=TrendingResponse)
async def get_upcoming_movies(lang: Lang = "en"):
    """Get upcoming movies"""
    try:
        movies = await movie_service.get_upcoming_movies(f"{lang}-US")
        formatted_movies = [movie_service.format_movie_for_response(movie) for movie in movies]
        return TrendingResponse(movies=formatted_movies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching upcoming movies: {str(e)}")

@app.get("/now-playing", response_model=TrendingResponse)
async def get_now_playing_movies(lang: Lang = "en"):
    """Get now playing movies"""
    try:
        movies = await movie_service.get_now_playing_movies(f"{lang}-US")
        formatted_movies = [movie_service.format_movie_for_response(movie) for movie in movies]
        return TrendingResponse(movies=formatted_movies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching now playing movies: {str(e)}")


@app.get("/movie/{movie_id}/videos")
async def get_movie_videos(movie_id: int, lang: Lang = "en"):
    """Get videos (trailers, teasers, clips) for a specific movie"""
    try:
        videos = await movie_service.get_movie_videos(movie_id, f"{lang}-US")
        return {"videos": videos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie videos: {str(e)}")

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_movie_discussions(request: AnalyzeRequest):
    """Analyze movie discussions and sentiment"""
    try:
        # Get movie data first
        movie_data = None
        try:
            # Search for the movie to get its ID
            search_results = await movie_service.search_movies(request.movie, f"{request.language}-US")
            if search_results:
                movie_data = search_results[0]  # Take the first result
        except Exception as e:
            print(f"Error fetching movie data: {e}")
        
        # For now, return mock data since we don't have actual social media analysis
        # In a real implementation, this would analyze actual social media posts
        return AnalyzeResponse(
            ok=True,
            summary=f"Analysis of discussions about '{request.movie}' over the last {request.time_range}. The movie has generated significant buzz across social media platforms with mixed reactions from audiences.",
            threads=42,
            sample_topics=[
                "Visual effects and cinematography",
                "Character development and acting",
                "Plot pacing and story structure",
                "Soundtrack and musical score",
                "Director's vision and execution"
            ],
            movie_data=movie_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing movie discussions: {str(e)}")

# News endpoints
@app.get("/news", response_model=NewsResponse)
async def get_film_news(lang: Lang = "en", page_size: int = 20):
    """Get film-related news articles"""
    try:
        # Map language codes to NewsAPI format
        lang_map = {
            "en": "en",
            "hi": "hi", 
            "ta": "ta",
            "te": "te",
            "es": "es"
        }
        news_lang = lang_map.get(lang, "en")
        
        articles = await news_service.get_film_news("movies", language=news_lang, page_size=page_size)
        formatted_articles = [news_service.format_news_for_response(article) for article in articles]
        
        return NewsResponse(
            articles=formatted_articles,
            total_results=len(formatted_articles)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching film news: {str(e)}")

@app.get("/news/search", response_model=NewsResponse)
async def search_film_news(query: str, lang: Lang = "en", page_size: int = 20):
    """Search for specific film-related news"""
    try:
        if not query.strip():
            raise HTTPException(status_code=400, detail="Query parameter is required")
        
        # Map language codes to NewsAPI format
        lang_map = {
            "en": "en",
            "hi": "hi", 
            "ta": "ta",
            "te": "te",
            "es": "es"
        }
        news_lang = lang_map.get(lang, "en")
        
        articles = await news_service.search_film_news(query, language=news_lang, page_size=page_size)
        formatted_articles = [news_service.format_news_for_response(article) for article in articles]
        
        return NewsResponse(
            articles=formatted_articles,
            total_results=len(formatted_articles)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching film news: {str(e)}")

# Social Media Analysis endpoint
@app.get("/analyze-social")
async def analyze_social_posts():
    """Analyze social media posts and return threads"""
    try:
        import os
        import traceback
        
        # Print debugging information
        print("Current directory:", os.getcwd())
        sample_posts_path = os.path.join(os.path.dirname(__file__), "sample_posts.json")
        print("Sample posts path:", sample_posts_path)
        print("File exists:", os.path.exists(sample_posts_path))
        
        # Load and process posts
        threads = social_service.analyze_all_posts(sample_posts_path)
        
        # Convert to response format
        response_data = []
        for thread in threads:
            thread_data = {
                "thread_id": thread.thread_id,
                "movie_title": thread.movie_title,
                "post_count": len(thread.posts),
                "summary": thread.summary,
                "sentiment": thread.sentiment,
                "sentiment_score": thread.sentiment_score,
                "posts": []
            }
            
            # Add posts with proper error handling
            for post in thread.posts:
                try:
                    post_data = {
                        "id": post.id,
                        "content": post.content,
                        "platform": post.platform,
                        "sentiment": post.sentiment if post.sentiment in ["positive", "negative", "neutral"] else "neutral",
                        "author": post.author,
                        "timestamp": post.timestamp
                    }
                    thread_data["posts"].append(post_data)
                except Exception as post_error:
                    print(f"Error processing post: {str(post_error)}")
                    continue
            
            response_data.append(thread_data)
        
        return {"threads": response_data, "total_threads": len(threads)}
    
    except Exception as e:
        print(f"Error in analyze_social_posts: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error analyzing posts: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8001)
    args = parser.parse_args()
    
    uvicorn.run(app, host="0.0.0.0", port=args.port)