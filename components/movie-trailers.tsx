"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Volume2, VolumeX } from "lucide-react"

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  published_at: string
}

interface MovieTrailersProps {
  movieId: number | null
  title?: string
}

export function MovieTrailers({ movieId, title }: MovieTrailersProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load selected movie videos when movieId changes
  useEffect(() => {
    if (movieId) {
      fetchMovieVideos(movieId)
    } else {
      // Clear videos when no movie is selected
      setVideos([]);
      setActiveVideo(null);
    }
  }, [movieId])

  const fetchMovieVideos = async (id: number) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Using relative URL to work in all environments
      const response = await fetch(`/api/movies/${id}/videos`, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(8000)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("API Response:", data) // Debug log
      
      // Check if data is an array directly or if it's in a videos property
      const videoArray = Array.isArray(data) ? data : 
                        (data.videos && Array.isArray(data.videos)) ? data.videos : 
                        (data.results && Array.isArray(data.results)) ? data.results : [];
      
      // Filter for YouTube videos only to ensure compatibility
      const youtubeVideos = videoArray.filter(video => 
        video.site?.toLowerCase() === 'youtube' && video.key
      );
      
      if (youtubeVideos.length > 0) {
        setVideos(youtubeVideos)
        setActiveVideo(youtubeVideos[0].key)
        console.log("Videos loaded:", youtubeVideos.length)
      } else {
        console.log("No YouTube videos found in response")
        setVideos([])
        setActiveVideo(null)
      }
    } catch (error) {
      console.error("Error fetching movie videos:", error)
      
      // Try fallback API endpoint if the first one fails
      try {
        // Use environment variable or fallback to a server-side API route
        const tmdbApiEndpoint = process.env.NEXT_PUBLIC_TMDB_API_ENDPOINT || `/api/tmdb/movie/${id}/videos`;
        const fallbackResponse = await fetch(tmdbApiEndpoint.replace('{id}', id.toString()), {
          headers: {
            'Content-Type': 'application/json',
          },
          // Add a timeout to prevent hanging requests
          signal: AbortSignal.timeout(5000)
        })
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          const fallbackVideos = fallbackData.results || []
          
          // Filter for YouTube videos
          const youtubeVideos = fallbackVideos.filter(video => 
            video.site?.toLowerCase() === 'youtube' && video.key
          )
          
          if (youtubeVideos.length > 0) {
            setVideos(youtubeVideos)
            setActiveVideo(youtubeVideos[0].key)
            setError(null)
            return
          }
        }
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError)
      }
      
      setError("Failed to load videos. Please try again.")
      setVideos([])
      setActiveVideo(null)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Only show the component if a movie is selected
  if (!movieId) {
    return null;
  }
  
  return (
    <div className="mb-12 bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-4 font-orbitron">
        {title || "Movie Trailers"}
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-400">Loading videos...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-red-400">{error}</div>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-400">No videos available for this movie</div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeVideo && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-4 right-4 bg-black/50"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.slice(0, 6).map((video) => (
              <Card
                key={video.id}
                className={`overflow-hidden cursor-pointer transition-all ${
                  activeVideo === video.key ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveVideo(video.key)}
              >
                <CardContent className="p-0 relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                    alt={video.name}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm line-clamp-1">{video.name}</h4>
                    <p className="text-xs text-gray-400">{video.type}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}