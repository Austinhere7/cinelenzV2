"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink, ChevronLeft, ChevronRight, Newspaper } from "lucide-react"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  source: string
  author: string | null
  content: string | null
}

interface NewsResponse {
  articles: NewsArticle[]
  total_results: number
}

export function FilmNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchLatestNews()
  }, [])

  const fetchLatestNews = async () => {
    // Use mock data for now to ensure the component displays
    const mockArticles: NewsArticle[] = [
      {
        title: "New Marvel Movie Breaks Box Office Records",
        description: "The latest Marvel superhero film has shattered opening weekend records worldwide.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png",
        publishedAt: new Date().toISOString(),
        source: "Entertainment Weekly",
        author: "John Smith",
        content: null
      },
      {
        title: "Director Announces Sequel to Award-Winning Drama",
        description: "The acclaimed director has confirmed a sequel is in development for next year.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/kdPMUMJzyYAc4roD52qavX0nLIC.jpg",
        publishedAt: new Date().toISOString(),
        source: "Variety",
        author: "Jane Doe",
        content: null
      },
      {
        title: "Indie Film Festival Announces This Year's Lineup",
        description: "The prestigious indie film festival has revealed an exciting lineup for this year's event.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/vB8o2p4ETnrjfeLa6qKqCLGFqzl.jpg",
        publishedAt: new Date().toISOString(),
        source: "IndieWire",
        author: "Robert Johnson",
        content: null
      },
      {
        title: "Acclaimed Director's New Film Gets Standing Ovation at Festival",
        description: "The latest work from the award-winning filmmaker received an 8-minute standing ovation at its premiere.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        publishedAt: new Date().toISOString(),
        source: "The Hollywood Reporter",
        author: "Emma Wilson",
        content: null
      },
      {
        title: "Classic Film Getting 4K Restoration and Theatrical Re-Release",
        description: "The beloved classic has been meticulously restored and will return to theaters next month.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
        publishedAt: new Date().toISOString(),
        source: "Film Comment",
        author: "David Chen",
        content: null
      },
      {
        title: "Streaming Platform Announces New Original Film Series",
        description: "The major streaming service has greenlit an ambitious slate of original films from renowned directors.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/4m1Au3YkjqsxF8iwQy0fPYSxE0h.jpg",
        publishedAt: new Date().toISOString(),
        source: "Deadline",
        author: "Sarah Johnson",
        content: null
      },
      {
        title: "Surprise Sequel Announcement Thrills Fans at Comic-Con",
        description: "Fans were shocked when the studio revealed a sequel to the beloved franchise is in production.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
        publishedAt: new Date().toISOString(),
        source: "Screen Rant",
        author: "Michael Brown",
        content: null
      },
      {
        title: "Rising Director Signs Multi-Picture Deal with Major Studio",
        description: "After their breakout indie hit, the promising filmmaker has secured a major studio partnership.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/pWsD91G2R1Da3AKM3ymr3UoIfRb.jpg",
        publishedAt: new Date().toISOString(),
        source: "Variety",
        author: "Thomas Lee",
        content: null
      },
      {
        title: "Anticipated Adaptation Reveals First Look Images",
        description: "The highly anticipated book-to-film adaptation has released its first official images.",
        url: "#",
        urlToImage: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        publishedAt: new Date().toISOString(),
        source: "Entertainment Weekly",
        author: "Lisa Garcia",
        content: null
      }
    ];
    
    // Always set mock articles first to ensure we have content
    setArticles(mockArticles);
    
    try {
      // Try the actual API call with proper error handling
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"; // Use local backend API
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced to 3 seconds
      
      const response = await fetch(`${API_URL}/now-playing?lang=en`, {
        headers: {
          'accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Convert TMDB movie results to our news article format
        const newsArticles = data.results.slice(0, 5).map((movie: any) => ({
          title: movie.title,
          description: movie.overview,
          url: `https://www.themoviedb.org/movie/${movie.id}`,
          urlToImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          publishedAt: movie.release_date,
          source: "TMDB",
          author: null,
          content: null
        }));
        
        setArticles(newsArticles);
      }
    } catch (error) {
      // Silently fail and use mock data - don't log to console in production
      if (process.env.NODE_ENV === 'development') {
        console.warn("Using mock news data - backend API not available", error);
      }
      // We already set mock articles, so continue with those
    }
  }


  const getCurrentArticles = () => {
    return articles
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const nextSlide = () => {
    const currentArticles = getCurrentArticles()
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(currentArticles.length / 3))
  }

  const prevSlide = () => {
    const currentArticles = getCurrentArticles()
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(currentArticles.length / 3)) % Math.ceil(currentArticles.length / 3))
  }

  const getVisibleArticles = () => {
    const currentArticles = getCurrentArticles()
    const startIndex = currentSlide * 3
    return currentArticles.slice(startIndex, startIndex + 3)
  }

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
            Film News
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto font-space-mono">
            Stay updated with the latest film industry news, releases, and entertainment updates
          </p>
        </div>


        {/* News Slider */}
        {getCurrentArticles().length > 0 ? (
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* News Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12">
              {getVisibleArticles().map((article, index) => (
                <Card key={`${article.title}-${index}`} className="bg-gray-900 border-gray-800 hover:border-red-500/50 transition-all duration-300 group h-full">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {article.urlToImage ? (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-600 text-white text-xs">
                        {article.source}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-red-400 transition-colors">
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex flex-col h-full">
                    <CardDescription className="text-gray-300 text-sm line-clamp-3 mb-4 flex-grow">
                      {article.description}
                    </CardDescription>
                    
                    <div className="mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-600 text-gray-300 hover:border-red-500 hover:text-white"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: Math.ceil(getCurrentArticles().length / 3) }, (_, i) => i).map((slideNum) => (
                <button
                  key={`slide-${slideNum}-of-${Math.ceil(getCurrentArticles().length / 3)}`}
                  onClick={() => setCurrentSlide(slideNum)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    slideNum === currentSlide ? "bg-red-600" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                Loading news...
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
