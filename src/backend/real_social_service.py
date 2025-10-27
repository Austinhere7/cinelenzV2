import tweepy
import praw
import asyncio
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import config
from social_analysis_service import Post, Thread, SocialAnalysisService

logger = logging.getLogger(__name__)

class RealSocialMediaService:
    def __init__(self):
        self.social_service = SocialAnalysisService()
        self.setup_clients()
        
    def setup_clients(self):
        """Initialize API clients if credentials are available"""
        self.twitter_client = None
        self.reddit_client = None
        
        # Setup Twitter client if credentials are available
        if config.TWITTER_BEARER_TOKEN != "your_twitter_bearer_token_here":
            try:
                self.twitter_client = tweepy.Client(
                    bearer_token=config.TWITTER_BEARER_TOKEN,
                    consumer_key=config.TWITTER_API_KEY,
                    consumer_secret=config.TWITTER_API_SECRET,
                    access_token=config.TWITTER_ACCESS_TOKEN,
                    access_token_secret=config.TWITTER_ACCESS_SECRET
                )
                logger.info("Twitter client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Twitter client: {str(e)}")
        
        # Setup Reddit client if credentials are available
        if config.REDDIT_CLIENT_ID != "your_reddit_client_id_here":
            try:
                self.reddit_client = praw.Reddit(
                    client_id=config.REDDIT_CLIENT_ID,
                    client_secret=config.REDDIT_CLIENT_SECRET,
                    user_agent=config.REDDIT_USER_AGENT
                )
                logger.info("Reddit client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Reddit client: {str(e)}")
    
    async def get_twitter_posts(self, movie_title: str, limit: int = 10) -> List[Post]:
        """Fetch tweets about a movie"""
        posts = []
        
        if not self.twitter_client:
            logger.warning("Twitter client not initialized. Skipping Twitter search.")
            return posts
        
        try:
            # Search for tweets about the movie
            query = f"\"{movie_title}\" movie -is:retweet"
            tweets = self.twitter_client.search_recent_tweets(
                query=query,
                max_results=limit,
                tweet_fields=['created_at', 'author_id', 'text']
            )
            
            if not tweets.data:
                return posts
                
            for i, tweet in enumerate(tweets.data):
                post = Post(
                    id=f"twitter_{i}_{tweet.id}",
                    content=tweet.text,
                    platform="twitter",
                    timestamp=tweet.created_at.isoformat() if tweet.created_at else "",
                    author=f"@user_{tweet.author_id}",
                    movie_mentioned=movie_title,
                    sentiment=self.social_service.analyze_post_sentiment(tweet.text)
                )
                posts.append(post)
                
        except Exception as e:
            logger.error(f"Error fetching Twitter data: {str(e)}")
            
        return posts
    
    async def get_reddit_posts(self, movie_title: str, limit: int = 10) -> List[Post]:
        """Fetch Reddit posts about a movie"""
        posts = []
        
        if not self.reddit_client:
            logger.warning("Reddit client not initialized. Skipping Reddit search.")
            return posts
        
        try:
            # Search for posts in movie-related subreddits
            subreddits = ["movies", "flicks", "truefilm", "boxoffice"]
            for subreddit_name in subreddits:
                subreddit = self.reddit_client.subreddit(subreddit_name)
                search_results = subreddit.search(f"{movie_title}", limit=limit//len(subreddits))
                
                for i, submission in enumerate(search_results):
                    # Use either the submission title or selftext if available
                    content = submission.selftext if submission.selftext else submission.title
                    post = Post(
                        id=f"reddit_{subreddit_name}_{i}_{submission.id}",
                        content=content,
                        platform="reddit",
                        timestamp=submission.created_utc.isoformat() if hasattr(submission, 'created_utc') else "",
                        author=submission.author.name if submission.author else "deleted",
                        movie_mentioned=movie_title,
                        sentiment=self.social_service.analyze_post_sentiment(content)
                    )
                    posts.append(post)
                    
                    # Get top comments if available
                    submission.comments.replace_more(limit=0)
                    for j, comment in enumerate(submission.comments[:3]):  # Get top 3 comments
                        if j >= 3:  # Limit to 3 comments per post
                            break
                        
                        comment_post = Post(
                            id=f"reddit_comment_{subreddit_name}_{i}_{j}_{comment.id}",
                            content=comment.body,
                            platform="reddit",
                            timestamp=comment.created_utc.isoformat() if hasattr(comment, 'created_utc') else "",
                            author=comment.author.name if comment.author else "deleted",
                            movie_mentioned=movie_title,
                            sentiment=self.social_service.analyze_post_sentiment(comment.body)
                        )
                        posts.append(comment_post)
                        
        except Exception as e:
            logger.error(f"Error fetching Reddit data: {str(e)}")
            
        return posts
    
    async def get_social_media_posts(self, movie_title: str) -> List[Post]:
        """Get posts from all available social media platforms"""
        twitter_task = asyncio.create_task(self.get_twitter_posts(movie_title))
        reddit_task = asyncio.create_task(self.get_reddit_posts(movie_title))
        
        # Wait for all tasks to complete
        twitter_posts, reddit_posts = await asyncio.gather(twitter_task, reddit_task)
        
        # Combine all posts
        all_posts = twitter_posts + reddit_posts
        
        # If no real posts found, use sample data as fallback
        if not all_posts:
            logger.warning(f"No real social media posts found for {movie_title}. Using sample data.")
            try:
                sample_posts = self.social_service.load_posts("src/backend/sample_posts.json")
                filtered_posts = self.social_service.filter_posts_by_movie(sample_posts, movie_title)
                if filtered_posts:
                    return filtered_posts
            except Exception as e:
                logger.error(f"Error loading sample posts: {str(e)}")
        
        return all_posts
    
    async def analyze_social_media(self, movie_title: str) -> Optional[Thread]:
        """Analyze social media posts for a movie"""
        posts = await self.get_social_media_posts(movie_title)
        
        if not posts:
            return None
            
        # Create a thread from the posts
        thread = self.social_service.analyze_thread(posts)
        return thread