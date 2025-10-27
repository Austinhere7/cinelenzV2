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

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "AIzaSyDBF1xdM64pDqtq-79aKX3VX37RdPjXhPk")

# TMDB API Configuration
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")  # Get your free API key from https://www.themoviedb.org/settings/api

# Twitter/X API Configuration (paid)
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY", "your_twitter_api_key_here")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET", "your_twitter_api_secret_here")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN", "your_twitter_access_token_here")
TWITTER_ACCESS_SECRET = os.getenv("TWITTER_ACCESS_SECRET", "your_twitter_access_secret_here")
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN", "your_twitter_bearer_token_here")

# Reddit API Configuration
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID", "your_reddit_client_id_here")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET", "your_reddit_client_secret_here")
REDDIT_USER_AGENT = "CineLenz/1.0"

# API Headers (TMDB uses api_key as query parameter, not Bearer token)
TMDB_HEADERS = {
    "accept": "application/json"
}

# NewsAPI Headers
NEWS_HEADERS = {
    "accept": "application/json"
}