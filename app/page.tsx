"use client"
// ... existing imports ...
import { FeaturesSection } from "@/components/features-section"
import { TechnologySection } from "@/components/technology-section"
import { AboutSection } from "@/components/about-section"
// import { SafetySection } from "@/components/safety-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import Hero3D from "@/components/hero-3d" // Declare the Hero3D variable
import AmbientBG from "@/components/ambient-bg" // add AmbientBG import for red blended background

import React, { useEffect, useState } from "react"

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200) // 1.2s loader
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="nav-loader" aria-hidden>
        <div
          className="nav-loader__backdrop"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgb(0, 0, 0)",
          }}
        >
          <img
            src="/cinelenzlogo.png"
            alt="CineLenz Logo"
            style={{
              width: "180px",
              height: "180px",
              objectFit: "contain",
              filter: "blur(12px) brightness(0.7)",
              opacity: 0.7,
            }}
          />
        </div>
        <div className="nav-loader__box" style={{ zIndex: 1, position: "relative" }}>
          <div className="nav-loader__spinner" />
          <div className="nav-loader__text">Loading…</div>
        </div>
      </div>
    )
  }

  return (
    <main className="relative overflow-hidden bg-black">
      {/* make main relative and hide overflow for ambient effects */}
      <AmbientBG /> {/* blended red ambient background behind all content */}
      {/* ... existing Hero ... */}
      <Hero3D />
      <FeaturesSection />
      <section id="how-it-works">
        <TechnologySection />
      </section>
      <AboutSection />
      {/* <section id="safety">
        <SafetySection />
      </section> */}
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
