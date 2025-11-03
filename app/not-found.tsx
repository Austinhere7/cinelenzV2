import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, Film } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Animation */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="w-24 h-24 md:w-32 md:h-32 text-primary animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Scene Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Looks like this page took an intermission and never came back. The content you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link href="/">
            <Button size="lg" className="gap-2 min-w-[200px]">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/get-started">
            <Button size="lg" variant="outline" className="gap-2 min-w-[200px]">
              <Search className="w-4 h-4" />
              Discover Movies
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-12 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Popular pages you might be looking for:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/get-started" className="text-sm text-primary hover:underline">
              Get Started
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/privacy" className="text-sm text-primary hover:underline">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/terms" className="text-sm text-primary hover:underline">
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/cookies" className="text-sm text-primary hover:underline">
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Error Code */}
        <div className="pt-8">
          <p className="text-xs text-muted-foreground">
            Error Code: HTTP 404 | Page Not Found
          </p>
        </div>
      </div>
    </div>
  )
}
