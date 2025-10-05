// ... existing imports ...
import { FeaturesSection } from "@/components/features-section"
import { TechnologySection } from "@/components/technology-section"
import { ApplicationsTimeline } from "@/components/applications-timeline"
import { AboutSection } from "@/components/about-section"
// import { SafetySection } from "@/components/safety-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { MovieSection } from "@/components/movie-section"
import { MovieAnalysis } from "@/components/movie-analysis"
import { FilmNewsSection } from "@/components/film-news-section"
import Hero3D from "@/components/hero-3d" // Declare the Hero3D variable
import AmbientBG from "@/components/ambient-bg" // add AmbientBG import for red blended background

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {" "}
      {/* make main relative and hide overflow for ambient effects */}
      <AmbientBG /> {/* blended red ambient background behind all content */}
      {/* ... existing Hero ... */}
      <Hero3D />
      <FeaturesSection />
      <MovieSection />
      <MovieAnalysis />
      <FilmNewsSection />
      <section id="how-it-works">
        <TechnologySection />
      </section>
      <ApplicationsTimeline />
      <AboutSection />
      {/* <section id="safety">
        <SafetySection />
      </section> */}
      <TestimonialsSection />
      <section id="examples">
        <FAQSection />
      </section>
      <CTASection />
    </main>
  )
}
