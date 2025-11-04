"use client"

import { useEffect, useState } from "react"

type Item = { id: number; title: string; year?: number; poster?: string }

const KEY = "cinelenz:watchlist"
const COMPARE_KEY = "cinelenz:compare"

export function useWatchlist() {
  const [items, setItems] = useState<Item[]>([])
  const [compare, setCompare] = useState<Item[]>([])

  useEffect(() => {
    try {
      const raw = globalThis.localStorage?.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
      const cr = globalThis.localStorage?.getItem(COMPARE_KEY)
      if (cr) setCompare(JSON.parse(cr))
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
    if (exists) {
      persistCompare(compare.filter(x => x.id !== it.id))
    } else {
      persistCompare([...compare, it])
    }
  }

  const removeFromCompare = (id: number) => {
    persistCompare(compare.filter(x => x.id !== id))
  }

  const clearCompare = () => persistCompare([])
  
  const isComparing = (id: number) => compare.some(x => x.id === id)

  return { items, toggle, isSaved, compare, toggleCompare, removeFromCompare, clearCompare, isComparing }
}
