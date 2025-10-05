"use client"

import type React from "react"
import useSWR from "swr"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { FilmNewsSection } from "@/components/film-news-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Range = "24h" | "week" | "month"

type AnalyzeResponse = {
  ok: boolean
  summary: string
  threads: number
  sample_topics: string[]
  movie_data?: any
}

type Movie = {
  id: number
  title: string
  overview?: string
  poster_path?: string
  backdrop_path?: string
  release_date?: string
  vote_average?: number
  vote_count?: number
  popularity?: number
  genre_ids?: number[]
  adult?: boolean
  original_language?: string
  original_title?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function GetStartedPage() {
  const [phase, setPhase] = useState<"welcome" | "form" | "results" | "search">("form")
  const [movie, setMovie] = useState("")
  const [range, setRange] = useState<Range>("24h")
  const [language, setLanguage] = useState<string>("en")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const {
    data: trending,
    isLoading: trendingLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: trendingError,
  } = useSWR<{ movies: Movie[] }>(`${API_URL}/trending?lang=${language}`, fetcher)

  function trendScoreFor(title: string) {
    let h = 0
    for (let i = 0; i < title.length; i++) h = (h << 5) - h + title.charCodeAt(i)
    const score = 35 + (Math.abs(h) % 61) // keep it between 35–96
    return Math.min(100, Math.max(0, score))
  }

  function generateUniqueKey(movie: Movie, index: number): string {
    // Use movie ID if available, otherwise use a combination of title and index
    if (movie.id) {
      return `movie-${movie.id}`
    }
    return `movie-${movie.title?.replace(/\s+/g, '-').toLowerCase() || 'unknown'}-${index}`
  }

  const trendingItems =
    trending?.movies?.map((movie, index) => ({
      id: generateUniqueKey(movie, index), // Generate unique key
      title: movie.title || `Movie ${index + 1}`,
      score: trendScoreFor(movie.title || `Movie ${index + 1}`),
      image: movie.poster_path || `/placeholder.svg?height=56&width=40&query=${encodeURIComponent(`${movie.title || `Movie ${index + 1}`} movie poster minimal`)}`,
    })) ?? []

  async function onSearch(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    const searchQuery = movie.trim()
    if (!searchQuery) {
      setError("Please enter a movie name.")
      return
    }

    // Reset any previous results and set loading state
    setSearchResults([])
    setResult(null)
    setPhase("search")
    setSearchLoading(true)
    
    try {
      console.log(`Searching for: "${searchQuery}"`)
      const res = await fetch(`${API_URL}/search?query=${encodeURIComponent(searchQuery)}&lang=${language}`)
      
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      
      const data: { movies: Movie[] } = await res.json()
      console.log(`Search results:`, data)
      
      if (data.movies && data.movies.length > 0) {
        setSearchResults(data.movies)
        setPhase("search")
        console.log(`Found ${data.movies.length} movies`)
      } else {
        setError("No movies found. Please try a different search term.")
        setPhase("form")
        console.log("No movies found")
      }
    } catch (err: any) {
      console.error("Search error:", err)
      setError(err?.message || "Something went wrong. Please try again.")
      setPhase("form")
    } finally {
      setSearchLoading(false)
    }
  }

  async function onAnalyze(selectedMovie: Movie) {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie: selectedMovie.title,
          time_range: range,
          language,
        }),
      })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      const data: AnalyzeResponse = await res.json()
      setResult(data)
      setPhase("results")
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
      {/* Movie Search Section - At the top */}
      <section className="mb-16">
        <h2
          className="text-pretty text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-center mb-4"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          Analyze Movie Discussions
        </h2>
        <p className="text-center text-sm md:text-base opacity-80 mb-8">Enter a movie name and explore the conversation.</p>

        {/* Search form with trending sidebar */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <form onSubmit={onSearch} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="movie">Movie name</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="movie"
                      placeholder="Enter a movie name"
                      value={movie}
                      onChange={(e) => setMovie(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          onSearch(e)
                        }
                      }}
                      required
                    />
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 transition-transform duration-150 active:scale-[0.98]"
                      disabled={searchLoading}
                      aria-label="Search"
                    >
                      {searchLoading ? "Searching..." : "Search"}
                    </Button>
                  </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium">Time range</legend>
              <RadioGroup value={range} onValueChange={(v) => setRange(v as Range)} className="grid grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="r-24h" />
                  <Label htmlFor="r-24h">Last 24h</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="week" id="r-week" />
                  <Label htmlFor="r-week">Week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="month" id="r-month" />
                  <Label htmlFor="r-month">Month</Label>
                </div>
              </RadioGroup>
            </fieldset>
            </form>

            {/* Search Results - Right below search bar */}
            {phase === "search" && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Search Results for "{movie}"
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {searchLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-sm text-muted-foreground">Searching for movies...</div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="grid gap-3">
                        {searchResults.slice(0, 10).map((movieResult) => (
                          <div
                            key={movieResult.id}
                            className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                            onClick={() => onAnalyze(movieResult)}
                          >
                            <img
                              src={movieResult.poster_path || "/placeholder.svg"}
                              alt={`${movieResult.title} poster`}
                              width={60}
                              height={90}
                              className="h-20 w-14 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{movieResult.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {movieResult.overview || "No overview available"}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {movieResult.release_date ? new Date(movieResult.release_date).getFullYear() : "N/A"}
                                </span>
                                {movieResult.vote_average && (
                                  <span className="text-xs text-muted-foreground">
                                    ⭐ {movieResult.vote_average.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Analyze
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground mb-4">No movies found for "{movie}"</p>
                        <p className="text-xs text-muted-foreground">Try searching with a different movie name or check your spelling.</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button onClick={() => setPhase("form")} variant="outline" aria-label="New search">
                        New search
                      </Button>
                      <Button
                        onClick={() => {
                          setMovie("")
                          setSearchResults([])
                          setResult(null)
                          setPhase("form")
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analysis Results - Right below search bar */}
            {phase === "results" && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Results for "{movie}"
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result ? (
                      <>
                        <p className="text-sm opacity-90">{result.summary}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-md bg-primary/10 px-3 py-1 text-sm text-primary">
                            Threads: {result.threads}
                          </span>
                          <span className="rounded-md bg-gray-500/10 px-3 py-1 text-sm opacity-80">Range: {range}</span>
                        </div>
                        {result.sample_topics?.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Sample topics</h3>
                            <div className="flex flex-wrap gap-2">
                              {result.sample_topics.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-full border px-3 py-1 text-xs opacity-90 hover:bg-white/5 transition"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-destructive">No results. Please try again.</p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button onClick={() => setPhase("form")} variant="outline" aria-label="New search">
                        New search
                      </Button>
                      <Button
                        onClick={() => {
                          setMovie("")
                          setResult(null)
                          setPhase("form")
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Trending Now Sidebar */}
          <aside className="md:col-span-1">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold tracking-tight" style={{ fontFamily: "var(--font-sora)" }}>
                  Trending now
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                {trendingLoading && <div className="text-xs text-muted-foreground">Loading trending…</div>}
                {!trendingLoading && trendingItems.length === 0 && (
                  <div className="text-xs text-muted-foreground">No trending data.</div>
                )}
                {trendingItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMovie(item.title)
                      window?.scrollTo?.({ top: 0, behavior: "smooth" })
                    }}
                    className="flex w-full items-center gap-3 rounded-md border border-border bg-background p-2 text-left hover:bg-accent transition"
                    aria-label={`Use trending movie ${item.title}`}
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={`${item.title} poster`}
                      width={40}
                      height={56}
                      className="h-14 w-10 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{item.title}</div>
                      <div className="mt-1 h-1.5 w-full rounded bg-muted">
                        <div
                          className="h-1.5 rounded bg-primary transition-[width] duration-500"
                          style={{ width: `${item.score}%` }}
                          aria-label={`Trending strength ${item.score}%`}
                        />
                      </div>
                    </div>
                    <div className="ml-1 shrink-0 text-xs tabular-nums text-muted-foreground">{item.score}%</div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>


      {/* Film News Section - Below search results */}
      <div className="mb-16">
        <FilmNewsSection />
      </div>
    </main>
  )
}
