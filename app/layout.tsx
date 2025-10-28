import type React from "react"
import type { Metadata, Viewport } from "next"
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
  icons: {
    icon: [
      { url: "/new-logo.png" },
      { url: "/new-logo.png", sizes: "16x16", type: "image/png" },
      { url: "/new-logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/new-logo.png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CineLenz",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
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
