"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, Calendar, TrendingUp, Play } from "lucide-react"

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
}

interface MovieResponse {
  movies: Movie[]
  total_results?: number
  page?: number
}

const genreMap: { [key: number]: string } = {
  28: "Action",
  12: "Adventure", 
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
}

export function MovieSection() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"trending" | "upcoming" | "search">("trending")
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchTrendingMovies()
    fetchUpcomingMovies()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch("http://localhost:8000/trending?lang=en")
      const data: MovieResponse = await response.json()
      setTrendingMovies(data.movies.slice(0, 8)) // Show first 8 movies
    } catch (error) {
      console.error("Error fetching trending movies:", error)
    }
  }

  const fetchUpcomingMovies = async () => {
    try {
      const response = await fetch("http://localhost:8000/upcoming?lang=en")
      const data: MovieResponse = await response.json()
      setUpcomingMovies(data.movies.slice(0, 8)) // Show first 8 movies
    } catch (error) {
      console.error("Error fetching upcoming movies:", error)
    }
  }

  const searchMovies = useCallback(async (query: string) => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(query)}&lang=en`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: MovieResponse = await response.json()
      
      // Always set results, even if empty
      setSearchResults(data.movies || [])
      setActiveTab("search")
      
      // If no results, show a message
      if (!data.movies || data.movies.length === 0) {
        console.log(`No movies found for query: ${query}`)
      }
    } catch (error) {
      console.error("Error searching movies:", error)
      // Set empty results on error to show "no results" state
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
        searchMovies(query)
      }
    }, 500) // 500ms delay
    
    setSearchTimeout(timeout)
  }, [searchMovies, searchTimeout])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchMovies(searchQuery)
  }

  const getCurrentMovies = () => {
    switch (activeTab) {
      case "trending":
        return trendingMovies
      case "upcoming":
        return upcomingMovies
      case "search":
        return searchResults
      default:
        return trendingMovies
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getGenreNames = (genreIds: number[]) => {
    return genreIds.map(id => genreMap[id] || "Unknown").slice(0, 2)
  }

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
            Discover Movies
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto font-space-mono">
            Explore trending, upcoming, and search through thousands of movies from around the world
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for movies..."
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
              onClick={() => setActiveTab("trending")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "trending"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Trending
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "upcoming"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Upcoming
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

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getCurrentMovies().map((movie) => (
            <Card key={movie.id} className="bg-gray-900 border-gray-800 hover:border-red-500/50 transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                {movie.poster_path ? (
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-800 flex items-center justify-center">
                    <Play className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-red-600 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    {movie.vote_average.toFixed(1)}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-red-400 transition-colors">
                  {movie.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(movie.release_date)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-gray-300 text-sm line-clamp-3 mb-3">
                  {movie.overview}
                </CardDescription>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {getGenreNames(movie.genre_ids).map((genre, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{movie.vote_count} votes</span>
                  <span className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {Math.round(movie.popularity)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {getCurrentMovies().length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                {activeTab === "search" 
                  ? "No movies found for your search"
                  : "Loading movies..."
                }
              </p>
              {activeTab === "search" && (
                <p className="text-gray-500 text-sm">
                  Try searching for popular movies like "Superman", "Dune", or "Barbie"
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
