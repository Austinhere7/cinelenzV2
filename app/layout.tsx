import type React from "react"
import type { Metadata } from "next"
import { Sora, Geist } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import NavigationLoader from "@/components/navigation-loader"
import { WatchlistProvider } from "@/hooks/use-watchlist"

export const metadata: Metadata = {
  title: "CineLenz — See cinema through the social lens",
  description: "Real-time social threads, sentiment, and trends for movies across X, Reddit, and YouTube.",
  generator: "v0.app",
}

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${geist.variable} antialiased dark`}>
      <body>
        <WatchlistProvider>
          <NavigationLoader />
          <Navbar />
          {children}
          <Footer />
        </WatchlistProvider>
      </body>
    </html>
  )
}
