"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, TrendingUp, Users } from "lucide-react"

interface Thread {
  thread_id: string
  movie_title: string
  post_count: number
  summary: string
  sentiment: string
  sentiment_score: number
  posts: Post[]
}

interface Post {
  id: string
  content: string
  platform: string
  author: string
  timestamp: string
}

export function SocialAnalysis() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8000/analyze-social")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setThreads(data.threads)
    } catch (error) {
      console.error("Error fetching analysis:", error)
      setError("Failed to analyze social media posts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-500"
      case "negative": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter": return "🐦"
      case "reddit": return "🔴"
      case "instagram": return "📷"
      default: return "💬"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Social Media Analysis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered analysis of movie discussions across social platforms
          </p>
        </div>
        <Button onClick={fetchAnalysis} disabled={loading} className="bg-primary hover:bg-primary/90">
          {loading ? "Analyzing..." : "Analyze Posts"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {threads.length > 0 && (
        <div className="grid gap-6">
          {threads.map((thread) => (
            <Card key={thread.thread_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{thread.movie_title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {thread.post_count} posts
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Score: {(thread.sentiment_score * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getSentimentColor(thread.sentiment)} text-white`}>
                    {thread.sentiment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Summary:</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                    {thread.summary}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Individual Posts:</h4>
                  <div className="space-y-3">
                    {thread.posts.map((post) => (
                      <div key={post.id} className="border-l-2 border-gray-200 pl-4 py-2">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{post.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {getPlatformIcon(post.platform)} {post.platform}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{post.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {threads.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analysis Yet</h3>
          <p className="text-gray-500 mb-4">
            Click "Analyze Posts" to see AI-powered insights from social media discussions
          </p>
        </div>
      )}
    </div>
  )
}
