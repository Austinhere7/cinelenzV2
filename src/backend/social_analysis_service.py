import json
from typing import List, Dict, Any
from dataclasses import dataclass

@dataclass
class Post:
    id: str
    content: str
    platform: str
    timestamp: str
    author: str
    movie_mentioned: str

@dataclass
class Thread:
    thread_id: str
    movie_title: str
    posts: List[Post]
    summary: str
    sentiment: str
    sentiment_score: float

class SocialAnalysisService:
    def __init__(self):
        pass
    
    def load_posts(self, file_path: str) -> List[Post]:
        """Load posts from JSON file"""
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        posts = []
        for post_data in data['posts']:
            posts.append(Post(**post_data))
        return posts
    
    def group_posts_by_movie(self, posts: List[Post]) -> Dict[str, List[Post]]:
        """Group posts by movie mentioned"""
        movie_groups = {}
        for post in posts:
            movie = post.movie_mentioned
            if movie not in movie_groups:
                movie_groups[movie] = []
            movie_groups[movie].append(post)
        return movie_groups
    
    def analyze_thread(self, posts: List[Post]) -> Thread:
        """Analyze a thread of posts about a movie (mock analysis)"""
        movie_title = posts[0].movie_mentioned
        
        # Mock analysis based on content keywords
        content = " ".join([post.content.lower() for post in posts])
        
        # Simple sentiment analysis based on keywords
        positive_words = ['amazing', 'incredible', 'awesome', 'love', 'great', 'excellent', 'perfect', 'masterpiece', 'genius', 'killed it', 'breathtaking', 'stunning', 'revolutionary', 'pure art', 'exceeded', 'incredible', 'beautiful', 'powerful', 'emotional']
        negative_words = ['terrible', 'awful', 'bad', 'hate', 'disappointing', 'boring', 'slow', 'weak', 'overrated', 'heavy-handed', 'fell flat', 'too dark', 'too long', 'pacing was off']
        
        positive_count = sum(1 for word in positive_words if word in content)
        negative_count = sum(1 for word in negative_words if word in content)
        
        if positive_count > negative_count:
            sentiment = "positive"
            sentiment_score = 0.7 + (positive_count - negative_count) * 0.1
        elif negative_count > positive_count:
            sentiment = "negative"
            sentiment_score = 0.3 - (negative_count - positive_count) * 0.1
        else:
            sentiment = "neutral"
            sentiment_score = 0.5
        
        # Generate mock summary
        if sentiment == "positive":
            summary = f"Fans are overwhelmingly positive about {movie_title}. The discussion highlights the film's strong points including visual effects, storytelling, and performances. Viewers are particularly impressed with the technical aspects and emotional impact."
        elif sentiment == "negative":
            summary = f"Mixed to negative reception for {movie_title}. Common criticisms include pacing issues, length concerns, and narrative weaknesses. Some viewers found it disappointing compared to expectations."
        else:
            summary = f"Mixed reception for {movie_title}. The discussion shows divided opinions with some praising certain aspects while others express concerns about specific elements of the film."
        
        return Thread(
            thread_id=f"thread_{movie_title.lower().replace(' ', '_').replace(':', '').replace('-', '_')}",
            movie_title=movie_title,
            posts=posts,
            summary=summary,
            sentiment=sentiment,
            sentiment_score=min(1.0, max(0.0, sentiment_score))
        )
    
    def analyze_all_posts(self, file_path: str) -> List[Thread]:
        """Analyze all posts and return threads"""
        posts = self.load_posts(file_path)
        movie_groups = self.group_posts_by_movie(posts)
        
        threads = []
        for movie, movie_posts in movie_groups.items():
            thread = self.analyze_thread(movie_posts)
            threads.append(thread)
        
        return threads