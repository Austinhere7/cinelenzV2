from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, Optional, List, Dict
from movie_service import MovieService
from news_service import NewsService

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

class NewsArticle(BaseModel):
    title: str
    description: str
    url: str
    urlToImage: Optional[str]
    publishedAt: str
    source: str
    author: Optional[str]
    content: Optional[str]

class NewsResponse(BaseModel):
    articles: List[NewsArticle]
    total_results: int

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/trending", response_model=TrendingResponse)
async def trending(lang: Lang = "en"):
    """Get trending movies from TMDB"""
    try:
        # Map language codes to TMDB format
        lang_map = {
            "en": "en-US",
            "hi": "hi-IN", 
            "ta": "ta-IN",
            "te": "te-IN",
            "es": "es-ES"
        }
        tmdb_lang = lang_map.get(lang, "en-US")
        
        movies = await movie_service.get_trending_movies(time_window="week", language=tmdb_lang)
        formatted_movies = [movie_service.format_movie_for_response(movie) for movie in movies[:20]]  # Limit to 20 movies
        
        return TrendingResponse(movies=formatted_movies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trending movies: {str(e)}")

@app.get("/search", response_model=MovieSearchResponse)
async def search_movies(query: str, lang: Lang = "en", page: int = 1):
    """Search for movies by title"""
    try:
        if not query.strip():
            raise HTTPException(status_code=400, detail="Query parameter is required")
        
        # Map language codes to TMDB format
        lang_map = {
            "en": "en-US",
            "hi": "hi-IN", 
            "ta": "ta-IN",
            "te": "te-IN",
            "es": "es-ES"
        }
        tmdb_lang = lang_map.get(lang, "en-US")
        
        movies = await movie_service.search_movies(query, language=tmdb_lang)
        formatted_movies = [movie_service.format_movie_for_response(movie) for movie in movies]
        
        return MovieSearchResponse(
            movies=formatted_movies,
            total_results=len(formatted_movies),
            page=page
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching movies: {str(e)}")

@app.get("/movie/{movie_id}", response_model=MovieDetailsResponse)
async def get_movie_details(movie_id: int, lang: Lang = "en"):
    """Get detailed information about a specific movie"""
    try:
        # Map language codes to TMDB format
        lang_map = {
            "en": "en-US",
            "hi": "hi-IN", 
            "ta": "ta-IN",
            "te": "te-IN",
            "es": "es-ES"
        }
        tmdb_lang = lang_map.get(lang, "en-US")
        
        movie = await movie_service.get_movie_details(movie_id, language=tmdb_lang)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        return MovieDetailsResponse(movie=movie)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movie details: {str(e)}")

@app.get("/upcoming", response_model=TrendingResponse)
async def get_upcoming_movies(lang: Lang = "en", page: int = 1):
    """Get upcoming movies"""
    try:
        # Map language codes to TMDB format
        lang_map = {
            "en": "en-US",
            "hi": "hi-IN", 
            "ta": "ta-IN",
            "te": "te-IN",
            "es": "es-ES"
        }
        tmdb_lang = lang_map.get(lang, "en-US")
        
        movies = await movie_service.get_upcoming_movies(language=tmdb_lang, page=page)
        formatted_movies = [movie_service.format_movie_for_response(movie) for movie in movies]
        
        return TrendingResponse(movies=formatted_movies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching upcoming movies: {str(e)}")

@app.get("/now-playing", response_model=TrendingResponse)
async def get_now_playing_movies(lang: Lang = "en", page: int = 1):
    """Get movies currently playing in theaters"""
    try:
        # Map language codes to TMDB format
        lang_map = {
            "en": "en-US",
            "hi": "hi-IN", 
            "ta": "ta-IN",
            "te": "te-IN",
            "es": "es-ES"
        }
        tmdb_lang = lang_map.get(lang, "en-US")
        
        movies = await movie_service.get_now_playing_movies(language=tmdb_lang, page=page)
        formatted_movies = [movie_service.format_movie_for_response(movie) for movie in movies]
        
        return TrendingResponse(movies=formatted_movies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching now playing movies: {str(e)}")

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    """Analyze a movie - enhanced with real movie data"""
    try:
        # Search for the movie first
        lang_map = {
            "en": "en-US",
            "hi": "hi-IN", 
            "ta": "ta-IN",
            "te": "te-IN",
            "es": "es-ES"
        }
        tmdb_lang = lang_map.get(req.language, "en-US")
        
        search_results = await movie_service.search_movies(req.movie, language=tmdb_lang)
        movie_data = None
        
        if search_results:
            # Get detailed info for the first result
            movie_id = search_results[0].get("id")
            if movie_id:
                movie_data = await movie_service.get_movie_details(movie_id, language=tmdb_lang)
        
        return AnalyzeResponse(
            ok=True,
            summary=f"Analysis for '{req.movie}' over {req.time_range} ({req.language}). Found {len(search_results)} related movies.",
            threads=42,
            sample_topics=["buzz", "box office", "performances", "reviews", "social media"],
            movie_data=movie_data
        )
    except Exception as e:
        return AnalyzeResponse(
            ok=False,
            summary=f"Error analyzing '{req.movie}': {str(e)}",
            threads=0,
            sample_topics=[],
            movie_data=None
        )

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
