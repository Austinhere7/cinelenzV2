"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MovieAutocomplete, type Suggestion } from "@/components/movie-autocomplete"
import { FilmNewsSection } from "@/components/film-news-section"
import { SocialAnalysis } from "@/components/social-analysis"
import { ReviewChart } from "@/components/review-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroBanner } from "@/components/hero-banner"
import { useWatchlist } from "@/hooks/use-watchlist"
import { CompareDrawer } from "@/components/compare-drawer"

type Range = "24h" | "week" | "month"

type AnalyzeResponse = {
  ok: boolean
  summary: string
  threads: number
  movie_data: {
    title: string
    year: number
    poster: string
  }
}

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// TMDB API configuration
const TMDB_API_KEY = "57c7972befba22855cb90fc9d5de2bc8"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

// Headers for API requests
const API_HEADERS = {
  accept: 'application/json',
  "Content-Type": "application/json"
}

function GetStartedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toggleCompare, isComparing } = useWatchlist()
  const [movie, setMovie] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [range, setRange] = useState<Range>("24h")
  const [language, setLanguage] = useState("en")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [phase, setPhase] = useState<"search" | "results">("search")
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [isClientMounted, setIsClientMounted] = useState(false)

  // Set isClientMounted to true after component mounts
  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  // Deep link: read ?title= from URL and auto-run analysis
  useEffect(() => {
    const title = searchParams?.get("title")
    if (!title) return
    setSearchTerm(title)
    // Fetch basic data for poster/year; fall back to title-only
    const run = async () => {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=en-US`)
        const data = await res.json()
        const first = data?.results?.[0]
        setResult({
          ok: true,
          summary: "",
          threads: 1,
          movie_data: {
            title,
            year: first?.release_date ? new Date(first.release_date).getFullYear() : 0,
            poster: first?.poster_path ? `https://image.tmdb.org/t/p/w500${first.poster_path}` : ""
          }
        })
        setPhase("results")
      } catch {
        setResult({ ok: true, summary: "", threads: 1, movie_data: { title, year: 0, poster: "" } })
        setPhase("results")
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Fetch trending movies directly without SWR to avoid hydration issues
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [trendingError, setTrendingError] = useState<Error | null>(null);
  
  // Fetch trending movies on component mount
  useEffect(() => {
    const fetchTrending = async () => {
      // Set default mock data first
      const mockData = [
        { id: 1, title: "Dune: Part Two", vote_average: 8.5, poster_path: "/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg" },
        { id: 2, title: "Deadpool & Wolverine", vote_average: 7.9, poster_path: "/kqF5TG4BNqw5eE3fKTkQZCFYo2J.jpg" },
        { id: 3, title: "Joker: Folie à Deux", vote_average: 7.2, poster_path: "/gKkl37BQuKTanygYQG1pyYgHGl.jpg" }
      ];
      
      setTrendingData(mockData);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Direct call to TMDB API instead of going through backend
        const res = await fetch(`${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=${language}`, {
          headers: {
            accept: 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch trending movies: ${res.status}`);
        }
        
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setTrendingData(data.results);
        }
      } catch (error: any) {
        console.error("Trending fetch error:", error);
        setTrendingError(error);
        // We already set mock data, so no need to do anything here
      }
    };
    
    if (isClientMounted) {
      fetchTrending();
    }
  }, [isClientMounted, language]);

  // Helper function to calculate trend score
  const getTrendScore = (score: number) => {
    return Math.min(Math.max(Math.round(score * 100), 30), 95)
  }

  // Generate stable keys for lists
  const getUniqueKey = (prefix: string, index: number, id?: number | string) => 
    id ? `${prefix}-${id}` : `${prefix}-${index}`
  
  // Use client-side only rendering to prevent hydration errors
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    setError("")
    setSearchResults([])

    // Mock data for immediate fallback
    const mockResults = [
      { id: 550, title: "Fight Club", release_date: "1999-10-15", poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", vote_average: 8.4 },
      { id: 155, title: "The Dark Knight", release_date: "2008-07-16", poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", vote_average: 8.5 }
    ];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Direct call to TMDB API instead of going through backend
      const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}&language=en-US&page=1`, {
        headers: {
          accept: 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        console.error(`Search failed with status: ${res.status}`);
        // Use mock results instead of throwing
        setSearchResults(mockResults);
        return;
      }
      
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        // If no results, use mock data
        setSearchResults(mockResults);
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err?.message || "Search failed. Please try again.");
      // Use mock results on error
      setSearchResults(mockResults);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    // Just use the onSearch function to avoid duplication
    onSearch(e)
  }

  const onAnalyze = async (
    movieId: string,
    preselected?: { id: number; title: string; release_date?: string; poster_path?: string }
  ) => {
    setMovie(movieId)
    setLoading(true)
    setError("")

    try {
      // Prefer preselected movie (from autocomplete) to avoid setState async race
      let selectedMovie = preselected || searchResults.find(m => m.id === Number(movieId))

      // As a fallback, fetch the movie details by id from TMDB if not found in state
      if (!selectedMovie) {
        try {
          const res = await fetch(`${TMDB_BASE_URL}/movie/${Number(movieId)}?api_key=${TMDB_API_KEY}&language=en-US`, { headers: { accept: 'application/json' } })
          if (res.ok) {
            const data = await res.json()
            selectedMovie = { id: data.id, title: data.title, release_date: data.release_date, poster_path: data.poster_path }
          }
        } catch {}
      }

      if (!selectedMovie) throw new Error("Movie not found")

      // Set the result directly to trigger the SocialAnalysis component
      setResult({
        ok: true,
        summary: "Analysis complete",
        threads: 1,
        movie_data: {
          title: selectedMovie.title,
          year: selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 0,
          poster: selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : ""
        }
      })
      // Update URL for deep link
      try { router.replace(`/get-started?title=${encodeURIComponent(selectedMovie.title)}`) } catch {}
      
      setPhase("results")
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Launch analysis when clicking a Trending movie card (bypasses searchResults)
  const onAnalyzeTrending = async (movieId: string) => {
    setMovie(movieId)
    setLoading(true)
    setError("")

    // Smooth scroll to top so the loader and results area are in view
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    try {
      const selectedMovie = trendingData.find((m: any) => m.id === Number(movieId))
      if (!selectedMovie) {
        throw new Error("Movie not found")
      }

      // Trigger SocialAnalysis with title and show poster/threads card
      setResult({
        ok: true,
        summary: "",
        threads: 1,
        movie_data: {
          title: selectedMovie.title,
          year: selectedMovie.release_date ? new Date(selectedMovie.release_date).getFullYear() : 0,
          poster: selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` : ""
        }
      })
      // Update URL for deep link
      try { router.replace(`/get-started?title=${encodeURIComponent(selectedMovie.title)}`) } catch {}

      setPhase("results")
    } catch (err: any) {
      console.error("Trending analysis error:", err)
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      // Keep the loader visible briefly so the user perceives progress
      setTimeout(() => setLoading(false), 600)
    }
  }

  return (
    <React.Fragment>
      {/* Full-screen loader overlay while fetching/analyzing */}
      {loading && (
        <div className="fixed inset-0 z-[9998] bg-background/70 backdrop-blur-sm flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading" />
        </div>
      )}
      {/* Letterboxd-style Hero Banner with random latest movie (offset under fixed navbar) */}
      <div className="mt-20 md:mt-24">
        <HeroBanner size="sm">
          <h2
            className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-center"
            style={{
              textShadow:
                "0 2px 8px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.55)",
              fontFamily: "var(--font-sora)",
            }}
          >
            DISCOVER MOVIES
          </h2>
        </HeroBanner>
      </div>
      
  <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-12 md:pt-12 md:pb-16">
        {/* No video trailers as per requirement */}

        {/* Movie Search Section - At the top */}
        <section className="mb-16">
          {/* Heading moved into HeroBanner overlay above */}

          {/* Centered Search Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={onSearch} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="movie-name" className="text-lg font-medium text-center block">
                  What movie are you looking for?
                </Label>
                <div className="space-y-3">
                  <MovieAutocomplete
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSelect={(s: Suggestion) => {
                      // Add to searchResults (top) and trigger analysis
                      const fake = [{ id: s.id, title: s.title, release_date: s.year ? `${s.year}-01-01` : undefined, poster_path: s.poster ? s.poster.replace('https://image.tmdb.org/t/p/w200','') : undefined }]
                      setSearchResults(fake)
                      onAnalyze(String(s.id), fake[0])
                    }}
                  />
                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 text-lg h-12 rounded-xl"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              <fieldset>
                <legend className="text-base font-medium mb-2 text-center">Time range</legend>
                <RadioGroup
                  value={range}
                  onValueChange={(value) => setRange(value as Range)}
                  className="flex justify-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24h" id="r1" />
                    <Label htmlFor="r1">Last 24h</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="week" id="r2" />
                    <Label htmlFor="r2">Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="month" id="r3" />
                    <Label htmlFor="r3">Month</Label>
                  </div>
                </RadioGroup>
              </fieldset>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            
            {/* Immediate Search Results Display - Client-side only */}
            {isMounted && loading && (
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
              </div>
            )}
            
            {isMounted && searchResults.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">Search Results</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {searchResults.slice(0, 6).map((movie) => (
                    <div 
                      key={getUniqueKey('search', 0, movie.id)} 
                      className="bg-card border rounded-md overflow-hidden cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02] hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40"
                      role="button"
                      tabIndex={0}
                      aria-label={`Analyze ${movie.title}`}
                      onClick={() => onAnalyze(movie.id.toString())}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAnalyze(movie.id.toString()) } }}
                    >
                      <div className="aspect-[2/3] bg-muted relative">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            className="object-cover w-full h-full transition-transform duration-200 ease-out hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-sm">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium truncate transition-colors duration-150 group-hover:text-primary">{movie.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"}
                        </p>
                        <div className="mt-2">
                          <Button 
                            type="button" 
                            size="sm" 
                            variant={isComparing(movie.id) ? "default" : "outline"} 
                            className="w-full font-semibold"
                            onClick={(e)=>{
                              e.stopPropagation();
                              toggleCompare({ 
                                id: movie.id, 
                                title: movie.title, 
                                year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined, 
                                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`:undefined 
                              })
                            }}
                          >
                            {isComparing(movie.id) ? '✓ Added to Compare' : 'Compare'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Social Media Analysis - Moved to top of trending list */}
        {(result?.movie_data?.title || searchResults.find(m => m.id === Number(movie))?.title) && (
          <div className="mb-16">
            <SocialAnalysis movieTitle={result?.movie_data?.title || searchResults.find(m => m.id === Number(movie))?.title} />
          </div>
        )}
        
        

        {/* Search Results */}
        {searchResults.length > 0 && phase === "search" && (
          <section className="mb-16">
            <h3 className="text-2xl font-semibold mb-6">Search Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {searchResults.map((movie) => (
                <Card key={movie.id} className="overflow-hidden cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02] hover:border-primary" onClick={() => onAnalyze(movie.id.toString())}>
                  <CardHeader className="p-0">
                    <div className="relative aspect-[2/3] bg-muted">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                            className="object-cover w-full h-full transition-transform duration-200 ease-out hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <CardTitle className="text-sm truncate">{movie.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown year"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Analysis Results */}
        {phase === "results" && result && (
          <section className="mb-16">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>{result.movie_data.title} ({result.movie_data.year})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.movie_data.poster ? (
                      <img
                        src={result.movie_data.poster}
                        alt={result.movie_data.title}
                        className="w-full rounded-md"
                      />
                    ) : (
                      <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                        No poster available
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Based on {result.threads} discussion threads
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="md:w-2/3">
                <ReviewChart movieTitle={result.movie_data.title} />
              </div>
            </div>
          </section>
        )}

        {/* Trending Now Section - moved below results */}
        <section id="films" className="mb-16">
          <h3 className="text-2xl font-semibold mb-6">Trending Now</h3>
          {isMounted && (
            <>
              {trendingError ? (
                <p className="text-red-500">Failed to load trending movies</p>
              ) : !trendingData ? (
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
                </div>
              ) : trendingData.length === 0 ? (
                <p className="text-muted-foreground">No trending data available</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {trendingData.map((movie: any, index: number) => (
                    <Card
                      key={getUniqueKey('trending', index, movie.id)}
                      className="overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary transition-transform duration-200 ease-out hover:scale-[1.02] hover:border-primary"
                      role="button"
                      tabIndex={0}
                      aria-label={`Analyze ${movie.title}`}
                      onClick={() => onAnalyzeTrending(movie.id.toString())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onAnalyzeTrending(movie.id.toString())
                        }
                      }}
                    >
                      <CardHeader className="p-0">
                        <div className="relative aspect-[2/3] bg-muted">
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.title}
                              className="object-cover w-full h-full transition-transform duration-200 ease-out hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3">
                        <CardTitle className="text-sm truncate">{movie.title}</CardTitle>
                        <div className="mt-2">
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${getTrendScore(movie.vote_average/10)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getTrendScore(movie.vote_average/10)}% trending
                          </p>
                          <div className="mt-2">
                            <Button 
                              type="button" 
                              size="sm" 
                              variant={isComparing(movie.id) ? "default" : "outline"} 
                              className="w-full font-semibold"
                              onClick={(e)=>{
                                e.stopPropagation();
                                toggleCompare({ 
                                  id: movie.id, 
                                  title: movie.title, 
                                  year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined, 
                                  poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`:undefined 
                                })
                              }}
                            >
                              {isComparing(movie.id) ? '✓ Added to Compare' : 'Compare'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Film News Section */}
        <div className="mb-16">
          <FilmNewsSection />
        </div>
      </div>

      {/* Compare Drawer for movie comparison - Outside container for proper positioning */}
      <CompareDrawer />
    </React.Fragment>
  )
}

export default function GetStarted() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GetStartedContent />
    </Suspense>
  )
}