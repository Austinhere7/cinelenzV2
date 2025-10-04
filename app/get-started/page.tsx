"use client"

import type React from "react"
import useSWR from "swr"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Range = "24h" | "week" | "month"

type AnalyzeResponse = {
  ok: boolean
  summary: string
  threads: number
  sample_topics: string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function GetStartedPage() {
  const [phase, setPhase] = useState<"welcome" | "form" | "results">("form")
  const [movie, setMovie] = useState("")
  const [range, setRange] = useState<Range>("24h")
  const [language, setLanguage] = useState<string>("en")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  const {
    data: trending,
    isLoading: trendingLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: trendingError,
  } = useSWR<{ movies: string[] }>(`${API_URL}/trending?lang=${language}`, fetcher)

  function trendScoreFor(title: string) {
    let h = 0
    for (let i = 0; i < title.length; i++) h = (h << 5) - h + title.charCodeAt(i)
    const score = 35 + (Math.abs(h) % 61) // keep it between 35–96
    return Math.min(100, Math.max(0, score))
  }

  const trendingItems =
    trending?.movies?.map((t) => ({
      id: t,
      title: t,
      score: trendScoreFor(t),
      image: `/placeholder.svg?height=56&width=40&query=${encodeURIComponent(`${t} movie poster minimal`)}`,
    })) ?? []

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!movie.trim()) {
      setError("Please enter a movie name.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie: movie.trim(),
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
      <div className="grid gap-8 md:grid-cols-3">
        <section aria-labelledby="analysis-form-title" className="md:col-span-2">
          <h2
            id="analysis-form-title"
            className="text-pretty text-3xl md:text-4xl font-semibold tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Analyze movie discussions
          </h2>
          <p className="mt-2 text-sm md:text-base opacity-80">Enter a movie name and explore the conversation.</p>

          {/* Language selector */}
          <div className="mt-5 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>

          {/* Search form */}
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="movie">Movie name</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="movie"
                  placeholder="Enter a movie name"
                  value={movie}
                  onChange={(e) => setMovie(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 transition-transform duration-150 active:scale-[0.98]"
                  disabled={loading}
                  aria-label="Search"
                >
                  {loading ? "Searching..." : "Search"}
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

          {/* Results block unchanged */}
          {phase === "results" && (
            <section aria-labelledby="results-title" className="animate-in fade-in-50 duration-300 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle id="results-title" className="text-lg md:text-xl">
                    Results for “{movie}”
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
            </section>
          )}
        </section>

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
    </main>
  )
}
