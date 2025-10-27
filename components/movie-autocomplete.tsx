"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const TMDB_API_KEY = "57c7972befba22855cb90fc9d5de2bc8"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export type Suggestion = {
  id: number
  title: string
  year?: number
  poster?: string
}

export function MovieAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter a movie name...",
}: {
  value: string
  onChange: (v: string) => void
  onSelect: (s: Suggestion) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement | null>(null)

  // Close when clicking outside
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  // Debounced search
  useEffect(() => {
    let active = true
    const v = value.trim()
    if (v.length < 2) {
      setItems([])
      setOpen(false)
      return
    }
    setLoading(true)
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(v)}&language=en-US&page=1`)
        const data = await res.json()
        if (!active) return
        const mapped: Suggestion[] = (data?.results ?? []).slice(0, 8).map((m: any) => ({
          id: m.id,
          title: m.title,
          year: m.release_date ? Number(new Date(m.release_date).getFullYear()) : undefined,
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : undefined,
        }))
        setItems(mapped)
        setOpen(mapped.length > 0)
      } catch {
        if (!active) return
        setItems([])
        setOpen(false)
      } finally {
        if (active) setLoading(false)
      }
    }, 250)
    return () => { active = false; clearTimeout(id) }
  }, [value])

  return (
    <div className="relative" ref={boxRef}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-2 border-gray-300 dark:border-gray-600 h-14 text-lg rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        aria-autocomplete="list"
        aria-expanded={open}
        role="combobox"
      />
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 rounded-md border bg-popover text-popover-foreground shadow-md">
          <ul className="max-h-80 overflow-auto p-2">
            {items.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted focus:bg-muted focus:outline-none"
                  onClick={() => { onSelect(s); setOpen(false) }}
                >
                  <div className="w-8 h-12 bg-muted overflow-hidden rounded">
                    {s.poster ? <img src={s.poster} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium leading-none">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.year ?? ""}</div>
                  </div>
                </button>
              </li>
            ))}
            {items.length === 0 && !loading && (
              <li className="p-2 text-sm text-muted-foreground">No suggestions</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
