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
                Loading news...
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
