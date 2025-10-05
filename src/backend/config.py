import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# TMDB API Configuration
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "57c7972befba22855cb90fc9d5de2bc8")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# NewsAPI Configuration
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "f6c16abcf22443789ac0f4bd8f85ae35")
NEWS_API_BASE_URL = "https://newsapi.org/v2"

# API Headers (TMDB uses api_key as query parameter, not Bearer token)
TMDB_HEADERS = {
    "accept": "application/json"
}

# NewsAPI Headers
NEWS_HEADERS = {
    "accept": "application/json"
}
