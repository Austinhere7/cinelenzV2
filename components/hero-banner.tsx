"use client"

import { useState, useEffect, type ReactNode } from "react"

interface Movie {
  id: number
  title: string
  backdrop_path: string | null
  vote_average: number
  release_date: string
}

type HeroBannerProps = {
  readonly size?: "sm" | "md" | "lg" // controls height
  readonly children?: ReactNode // overlay content
  readonly className?: string // extra wrapper classes
}

export function HeroBanner({ size = "sm", children, className }: HeroBannerProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRandomLatestMovie()
  }, [])

  const fetchRandomLatestMovie = async () => {
    try {
      const TMDB_API_KEY = "57c7972befba22855cb90fc9d5de2bc8"
      const TMDB_BASE_URL = "https://api.themoviedb.org/3"
      
      // Fetch now playing English movies
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&region=US&page=1`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        // Filter movies with backdrop images
        const moviesWithBackdrops = data.results.filter(
          (m: Movie) => m.backdrop_path !== null
        )
        
        if (moviesWithBackdrops.length > 0) {
          // Pick a random movie
          const randomIndex = Math.floor(Math.random() * Math.min(moviesWithBackdrops.length, 10))
          setMovie(moviesWithBackdrops[randomIndex])
        }
      }
    } catch (error) {
      console.error("Error fetching movie:", error)
    } finally {
      setIsLoading(false)
    }
  }

  let heightClass: string
  if (size === "lg") {
    heightClass = "h-[520px] md:h-[620px] lg:h-[720px]"
  } else if (size === "md") {
    heightClass = "h-[420px] md:h-[520px] lg:h-[620px]"
  } else {
    heightClass = "h-[320px] md:h-[420px] lg:h-[520px]" // sm (default) smaller
  }

  if (isLoading || !movie) {
    return <div className={`relative w-full ${heightClass} bg-gray-900 animate-pulse ${className ?? ""}`} />
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden ${className ?? ""}`}>
      {/* Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${backdropUrl})`,
        }}
      />
      
      {/* Letterboxd-style fade mask - fades to edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, 
            rgba(0, 0, 0, 0.9) 0%, 
            rgba(0, 0, 0, 0.3) 15%, 
            rgba(0, 0, 0, 0.1) 30%, 
            transparent 40%, 
            transparent 60%, 
            rgba(0, 0, 0, 0.1) 70%, 
            rgba(0, 0, 0, 0.3) 85%, 
            rgba(0, 0, 0, 0.9) 100%)`
        }}
      />
      
      {/* Bottom gradient for smooth transition */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, transparent 100%)'
        }}
      />

      {/* Center overlay slot (for headings/buttons) */}
      {children ? (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          {/* subtle radial behind text for readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0) 75%)",
            }}
          />
          <div className="relative text-center">{children}</div>
        </div>
      ) : null}
    </div>
  )
}
