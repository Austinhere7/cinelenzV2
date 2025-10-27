"use client"

import { useMemo } from "react"

const STOP = new Set([
  'the','a','an','and','or','but','to','of','in','on','for','is','it','this','that','with','as','its','was','are','be','by','at','from','have','has','had','i','you','he','she','they','we','them','his','her','their','our','my','your','me','him','her','us','not','so','if','than','then','too','very','just','also','can','could','would','should','will','did','do','does','been','into','over','about'
])

export function ReviewPhrases({ texts, max = 30, exclude = [] as readonly string[] }: { readonly texts: string[]; readonly max?: number; readonly exclude?: readonly string[] }) {
  const items = useMemo(() => {
    const counts = new Map<string, number>()
    const inc = (k: string) => counts.set(k, (counts.get(k) || 0) + 1)

    const exc = new Set(exclude.map(e => e.toLowerCase()))

    const pushToken = (t: string) => {
      const w = t.toLowerCase().replaceAll(/[^a-z0-9']/g, '')
      if (!w || w.length < 3 || STOP.has(w)) return
      if (exc.has(w)) return
      if (/^\d+$/.test(w)) return
      inc(w)
    }

    for (const t of texts) {
      const tokens = t.split(/\s+/)
      for (let i = 0; i < tokens.length; i++) {
        pushToken(tokens[i])
        if (i + 1 < tokens.length) {
          const bi = `${tokens[i]} ${tokens[i+1]}`.toLowerCase()
          const clean = bi.replaceAll(/[^a-z0-9'\s]/g, '')
          const parts = clean.split(' ')
          if (parts.some(p => exc.has(p)) || exc.has(clean)) continue
          if (parts.every(w => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w))) inc(clean)
        }
      }
    }

    return Array.from(counts.entries())
      .sort((a,b) => b[1]-a[1])
      .slice(0, max)
  }, [texts, max, exclude])

  if (items.length === 0) return null

  const maxCount = Math.max(...items.map(([,n]) => n))

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([word, n]) => {
        const w = 0.6 + 0.4 * (n / maxCount)
        return (
          <span
            key={word}
            className="px-2 py-1 rounded-md bg-muted text-foreground"
            style={{ fontSize: `${Math.round(12 + 8 * (n/maxCount))}px`, opacity: w }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}
