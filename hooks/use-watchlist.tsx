"use client"

import { useEffect, useState, createContext, useContext, useMemo } from "react"

type Item = { id: number; title: string; year?: number; poster?: string }

const KEY = "cinelenz:watchlist"
const COMPARE_KEY = "cinelenz:compare"

type WatchlistContextType = {
  items: Item[]
  compare: Item[]
  toggle: (it: Item) => void
  isSaved: (id: number) => boolean
  toggleCompare: (it: Item) => void
  removeFromCompare: (id: number) => void
  clearCompare: () => void
  isComparing: (id: number) => boolean
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const [compare, setCompare] = useState<Item[]>([])

  useEffect(() => {
    try {
      const raw = globalThis.localStorage?.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
      // Always start with empty compare list on refresh
      setCompare([])
      globalThis.localStorage?.removeItem(COMPARE_KEY)
    } catch {}
  }, [])

  const persist = (next: Item[]) => {
    setItems(next)
    try { globalThis.localStorage?.setItem(KEY, JSON.stringify(next)) } catch {}
  }
  
  const persistCompare = (next: Item[]) => {
    setCompare(next)
    try { globalThis.localStorage?.setItem(COMPARE_KEY, JSON.stringify(next)) } catch {}
  }

  const toggle = (it: Item) => {
    const exists = items.some(x => x.id === it.id)
    persist(exists ? items.filter(x => x.id !== it.id) : [...items, it])
  }

  const isSaved = (id: number) => items.some(x => x.id === id)

  const toggleCompare = (it: Item) => {
    const exists = compare.some(x => x.id === it.id)
    persistCompare(exists ? compare.filter(x => x.id !== it.id) : [...compare, it])
  }

  const removeFromCompare = (id: number) => {
    persistCompare(compare.filter(x => x.id !== id))
  }

  const clearCompare = () => persistCompare([])
  
  const isComparing = (id: number) => compare.some(x => x.id === id)

  const value = useMemo(
    () => ({ items, toggle, isSaved, compare, toggleCompare, removeFromCompare, clearCompare, isComparing }),
    [items, compare]
  )

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider")
  }
  return context
}
