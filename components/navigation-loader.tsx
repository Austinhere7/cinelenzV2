"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

/**
 * NavigationLoader
 * - shows a full-screen subtle loader on link clicks / navigation start
 * - hides when the pathname changes or after a short timeout
 * Designed to match site dark theme using CSS variables defined in globals.css
 */
export default function NavigationLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    // hide when pathname changes (navigation finished)
    if (pending) {
      setPending(false)
      // give a tiny delay to make transitions feel smooth
      const t = setTimeout(() => setVisible(false), 220)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (globalThis.window === undefined) return

    function onClick(e: MouseEvent) {
      // find nearest anchor
      let node = e.target as HTMLElement | null
      while (node && node !== document.body) {
        if (node.tagName === "A") {
          const a = node as HTMLAnchorElement
          // only intercept same-origin navigations with href
          if (a.href && a.target !== "_blank" && a.getAttribute("href")?.startsWith("/")) {
            setVisible(true)
            setPending(true)
            return
          }
        }
        node = node.parentElement
      }
    }

    function onPopState() {
      setVisible(true)
      setPending(true)
    }

    globalThis.addEventListener("click", onClick, true)
    globalThis.addEventListener("popstate", onPopState)
    return () => {
      globalThis.removeEventListener("click", onClick, true)
      globalThis.removeEventListener("popstate", onPopState)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="nav-loader" aria-hidden>
      <div className="nav-loader__backdrop" />
      <div className="nav-loader__box">
        <div className="nav-loader__spinner" />
        <div className="nav-loader__text">Loading…</div>
      </div>
    </div>
  )
}
