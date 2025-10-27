"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useState, useEffect } from "react"
import { ReviewChart } from "@/components/review-chart"
import { SocialAnalysis } from "@/components/social-analysis"
import { X } from "lucide-react"

export function CompareDrawer() {
  const { compare, removeFromCompare, clearCompare } = useWatchlist()
  const [open, setOpen] = useState(false)
  const [showFullReviews, setShowFullReviews] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const canCompare = compare.length >= 2

  const getGridClasses = () => {
    if (compare.length === 2) return 'grid gap-6 grid-cols-1 md:grid-cols-2'
    if (compare.length === 3) return 'grid gap-6 grid-cols-1 md:grid-cols-3'
    return 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  // Don't render if not mounted or no movies in compare
  if (!mounted || compare.length === 0) return null

  return (
    <>
      {/* Only show floating box when drawer is closed */}
      {!open && (
        <div className="fixed bottom-4 inset-x-0 z-[60] flex justify-center pointer-events-none animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-background border rounded-lg shadow-lg px-5 py-3 flex items-center gap-4 pointer-events-auto max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold">Compare ({compare.length}):</span>
              {compare.map((movie) => (
                <Badge key={movie.id} variant="secondary" className="gap-1.5 py-1.5 px-3 animate-in fade-in duration-200">
                  <span className="text-sm">{movie.title.length > 20 ? movie.title.slice(0, 20) + '...' : movie.title}</span>
                  <button 
                    onClick={() => removeFromCompare(movie.id)} 
                    className="hover:text-destructive transition-colors ml-1"
                    title="Remove from compare"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                size="sm" 
                onClick={() => setOpen(true)} 
                disabled={!canCompare}
                className="font-semibold"
              >
                {canCompare ? 'Compare' : 'Add 1 more'}
              </Button>
              <Button size="sm" variant="ghost" onClick={clearCompare}>Clear All</Button>
            </div>
          </div>
        </div>
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>Compare {compare.length} Movies</DrawerTitle>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={showFullReviews ? "default" : "outline"}
                onClick={() => setShowFullReviews(!showFullReviews)}
              >
                {showFullReviews ? 'Show Charts Only' : 'Show Full Reviews'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Close</Button>
            </div>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {open && (
              showFullReviews ? (
                /* Full reviews split view - Only render when drawer is open */
                <div className="space-y-6">
                  {compare.map((movie) => (
                    <div key={movie.id} className="border rounded-lg p-4 bg-card">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{movie.title}</h3>
                          {movie.year && <p className="text-sm text-muted-foreground">{movie.year}</p>}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeFromCompare(movie.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Chart and Full Social Analysis */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                          <ReviewChart movieTitle={movie.title} />
                        </div>
                        <div className="lg:col-span-2">
                          <SocialAnalysis movieTitle={movie.title} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Charts-only view - Only render when drawer is open */
                <div className={getGridClasses()}>
                  {compare.map((movie) => (
                    <div key={movie.id} className="border rounded-lg p-4 bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{movie.title}</h3>
                          {movie.year && <p className="text-sm text-muted-foreground">{movie.year}</p>}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeFromCompare(movie.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <ReviewChart movieTitle={movie.title} />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
