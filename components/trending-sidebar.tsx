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
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">Trending now</h3>
        <div className="inline-flex items-center gap-2">
          <label htmlFor="lang" className="text-xs text-muted-foreground">
            Language
          </label>
          <select
            id="lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border bg-background px-2 py-1 text-xs text-foreground"
            aria-label="Filter trending by language"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="ta">TA</option>
            <option value="te">TE</option>
            <option value="es">ES</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading && <div className="text-xs text-muted-foreground">Loading trending…</div>}
        {error && <div className="text-xs text-destructive">Couldn&apos;t load trending.</div>}
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
                    <div className="truncate text-sm font-medium">{item.title}</div>
                    <div className="mt-1 h-1.5 w-full rounded bg-muted">
                      <div
                        className="h-1.5 rounded bg-primary transition-[width] duration-500"
                        style={{ width: `${score}%` }}
                        aria-label={`Trending strength ${score}%`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 text-xs tabular-nums text-muted-foreground">{score}%</div>
                    <CompareButton movie={{ id: item.id, title: item.title }} />
                  </div>
                </div>
              )
            })
          : !isLoading && <div className="text-xs text-muted-foreground">No trending data.</div>}
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
