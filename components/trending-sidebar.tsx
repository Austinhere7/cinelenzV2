"use client"

import useSWR from "swr"
import { useState } from "react"
import { useWatchlist } from "@/hooks/use-watchlist"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

type TrendingItem = {
  id: string
  title: string
  score: number // 0 - 100
  image?: string
}

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTFkZDNkNmY0YjQ4ZTNmNWE5Y2Q1YzBlNzU5NWJmNiIsInN1YiI6IjY1ZjQ3YzRmZWE4NGM3MDE3YzFkZGJkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7vS5I_fyS_qkmmBPZNZ_XWFwZ8EEwV5t7Avl0Yc_4Yw"}`
      },
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000)
    })
    if (!res.ok) throw new Error(`Failed to fetch trending: ${res.status}`)
    return res.json()
  } catch (error) {
    console.error("Error fetching trending:", error)
    // Return mock data as fallback
    return {
      items: [
        { id: "1", title: "Dune: Part Two", score: 95, image: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg" },
        { id: "2", title: "Deadpool & Wolverine", score: 90, image: "https://image.tmdb.org/t/p/w500/kqFqzUYZytjGIrM8sSQDGAMWZQX.jpg" },
        { id: "3", title: "Joker: Folie à Deux", score: 85, image: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgHGl.jpg" },
        { id: "4", title: "Venom: The Last Dance", score: 80, image: "https://image.tmdb.org/t/p/w500/6WgZ7qvTLtxc5vSUZWLgfQRHRl.jpg" }
      ]
    }
  }
}

export function TrendingSidebar({ initialLanguage = "en" }: { initialLanguage?: string }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000"
  const [language, setLanguage] = useState(initialLanguage)

  const { data, error, isLoading } = useSWR<{ items: TrendingItem[] }>(
    `${apiBase}/trending?lang=${encodeURIComponent(language)}`,
    fetcher,
    { revalidateOnFocus: false },
  )

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight mb-1">🔥 Trending Movies</h3>
          <p className="text-xs text-muted-foreground">Popular films based on social buzz</p>
        </div>
        <div className="inline-flex items-center gap-2">
          <label htmlFor="lang" className="text-xs text-muted-foreground">
            Language
          </label>
          <select
            id="lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border bg-background px-2 py-1 text-xs text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Filter trending by language"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border border-border bg-background p-3 animate-pulse">
                <div className="h-14 w-10 rounded bg-muted" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-2 w-full rounded bg-muted" />
                </div>
                <div className="h-7 w-7 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <div className="text-sm text-destructive mb-2">⚠️ Unable to load trending movies</div>
            <div className="text-xs text-muted-foreground">Check your connection and try again</div>
          </div>
        )}
        {data?.items?.length
          ? data.items.map((item) => {
              const score = Math.max(0, Math.min(100, Math.round(item.score || 0)))
              const img =
                item.image ||
                `/placeholder.svg?height=56&width=40&query=${encodeURIComponent(`${item.title} movie poster`)}`
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-md border border-border bg-background p-2"
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${item.title} poster`}
                    width={40}
                    height={56}
                    className="h-14 w-10 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{item.title}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-[width] duration-500"
                          style={{ width: `${score}%` }}
                          aria-label={`Social buzz strength: ${score}%`}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs tabular-nums font-medium text-muted-foreground">{score}%</span>
                        <span className="text-xs text-muted-foreground">buzz</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <CompareButton movie={{ id: item.id, title: item.title }} />
                  </div>
                </div>
              )
            })
          : !isLoading && !error && (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground mb-2">📭 No trending movies found</div>
                <div className="text-xs text-muted-foreground">Try changing the language filter</div>
              </div>
            )}
      </div>
    </div>
  )
}

// Compare button component for each trending item
function CompareButton({ movie }: { movie: { id: string; title: string } }) {
  const { isComparing, toggleCompare } = useWatchlist()
  const comparing = isComparing(Number(movie.id))

  return (
    <Button
      size="sm"
      variant={comparing ? "default" : "outline"}
      className="h-7 w-7 p-0"
      onClick={() => toggleCompare({ id: Number(movie.id), title: movie.title })}
      title={comparing ? "Remove from compare" : "Add to compare"}
    >
      {comparing ? <Check className="h-3 w-3" /> : <span className="text-xs">+</span>}
    </Button>
  )
}
