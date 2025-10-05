"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, ExternalLink, ChevronLeft, ChevronRight, Newspaper } from "lucide-react"

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
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"latest" | "search">("latest")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchLatestNews()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const fetchLatestNews = async () => {
    try {
      const response = await fetch("http://localhost:8000/news?lang=en&page_size=20")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: NewsResponse = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error("Error fetching latest news:", error)
      setArticles([])
    }
  }

  const searchNews = useCallback(async (query: string) => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/news/search?query=${encodeURIComponent(query)}&lang=en&page_size=20`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: NewsResponse = await response.json()
      setSearchResults(data.articles || [])
      setActiveTab("search")
      
      if (!data.articles || data.articles.length === 0) {
        console.log(`No news found for query: ${query}`)
      }
    } catch (error) {
      console.error("Error searching news:", error)
      setSearchResults([])
      setActiveTab("search")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    const timeout = setTimeout(() => {
      if (query.trim()) {
        searchNews(query)
      }
    }, 500) // 500ms delay
    
    setSearchTimeout(timeout)
  }, [searchNews, searchTimeout])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchNews(searchQuery)
  }

  const getCurrentArticles = () => {
    return activeTab === "latest" ? articles : searchResults
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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search film news..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  debouncedSearch(e.target.value)
                }}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("latest")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "latest"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Newspaper className="w-4 h-4 inline mr-2" />
              Latest News
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "search"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Search Results
            </button>
          </div>
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
              {Array.from({ length: Math.ceil(getCurrentArticles().length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-red-600" : "bg-gray-600"
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
                {activeTab === "search" 
                  ? "No news found for your search"
                  : "Loading news..."
                }
              </p>
              {activeTab === "search" && (
                <p className="text-gray-500 text-sm">
                  Try searching for "Marvel", "Disney", "Oscar", or "Box Office"
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
