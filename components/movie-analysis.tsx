"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, MessageSquare, BarChart3, Calendar } from "lucide-react"

interface AnalysisResult {
  ok: boolean
  summary: string
  threads: number
  sample_topics: string[]
  movie_data?: {
    id: number
    title: string
    overview: string
    poster_path: string | null
    release_date: string
    vote_average: number
    popularity: number
  }
}

export function MovieAnalysis() {
  const [query, setQuery] = useState("")
  const [timeRange, setTimeRange] = useState<"24h" | "week" | "month">("week")
  const [language, setLanguage] = useState<"en" | "hi" | "ta" | "te" | "es">("en")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyzeMovie = async () => {
    if (!query.trim()) return

    setIsAnalyzing(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const TMDB_HEADERS = {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTFkZDNkNmY0YjQ4ZTNmNWE5Y2Q1YzBlNzU5NWJmNiIsInN1YiI6IjY1ZjQ3YzRmZWE4NGM3MDE3YzFkZGJkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7vS5I_fyS_qkmmBPZNZ_XWFwZ8EEwV5t7Avl0Yc_4Yw"}`
      }
      
      // First search for the movie using TMDB API
      const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`, {
        headers: TMDB_HEADERS,
        signal: AbortSignal.timeout(5000)
      });
      
      if (!searchResponse.ok) {
        throw new Error(`Movie search failed: ${searchResponse.status}`);
      }
      
      const searchData = await searchResponse.json();
      const movieId = searchData.results && searchData.results.length > 0 ? searchData.results[0].id : null;
      
      // Then analyze the movie
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie: query,
          movie_id: movieId,
          time_range: timeRange,
          language: language,
        }),
        signal: AbortSignal.timeout(8000)
      })

      const data: AnalysisResult = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error analyzing movie:", error)
      setResult({
        ok: false,
        summary: "Error analyzing movie. Please try again.",
        threads: 0,
        sample_topics: [],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    analyzeMovie()
  }

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
            Analyze Movie Buzz
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto font-space-mono">
            Get real-time sentiment analysis and social media insights for any movie
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Analysis Form */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Movie Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Enter a movie title to analyze social media sentiment and buzz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter movie title (e.g., Superman, Dune, Barbie)"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isAnalyzing || !query.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white px-8"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time Range
                    </label>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value as "24h" | "week" | "month")}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="24h">Last 24 Hours</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "ta" | "te" | "es")}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Movie Info */}
              {result.movie_data && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Movie Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {result.movie_data.poster_path && (
                        <img
                          src={result.movie_data.poster_path}
                          alt={result.movie_data.title}
                          className="w-20 h-28 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-2">
                          {result.movie_data.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                          {result.movie_data.overview}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(result.movie_data.release_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {Math.round(result.movie_data.popularity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analysis Summary */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={result.ok ? "bg-green-600" : "bg-red-600"}>
                        {result.ok ? "Success" : "Error"}
                      </Badge>
                      <span className="text-gray-300 text-sm">
                        {timeRange === "24h" ? "Last 24 Hours" : 
                         timeRange === "week" ? "Last Week" : "Last Month"}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm">
                      {result.summary}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-semibold">
                          {result.threads} threads
                        </span>
                      </div>
                    </div>

                    {result.sample_topics.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Key Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.sample_topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Example Movies */}
          <div className="mt-12">
            <h3 className="text-white text-xl font-semibold mb-4 text-center">
              Try analyzing these popular movies:
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {["Superman", "Dune", "Barbie", "Oppenheimer", "The Batman", "Spider-Man"].map((movie) => (
                <Button
                  key={movie}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(movie)}
                  className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-white"
                >
                  {movie}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
