import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10 font-geist">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 font-orbitron">Terms of Service</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground leading-relaxed">
                Welcome to CineLenz! These Terms of Service govern your use of our movie discovery and social sentiment analysis platform. By accessing or using CineLenz, you agree to these terms.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing CineLenz's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">2. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CineLenz provides:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Movie Discovery:</strong> Search and browse movies from The Movie Database (TMDB)</li>
                <li><strong>Social Sentiment Analysis:</strong> Aggregated analysis of public movie reviews and social media reactions</li>
                <li><strong>Multi-Platform Reviews:</strong> Reviews from TMDB, IMDB, Rotten Tomatoes, Metacritic, YouTube, and The Guardian</li>
                <li><strong>Trending Insights:</strong> Real-time trending movies based on social buzz and popularity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">3. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">While using CineLenz, you agree to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the service for personal, non-commercial purposes</li>
                <li>Not attempt to scrape, copy, or download large amounts of data</li>
                <li>Not interfere with or disrupt the service or servers</li>
                <li>Not use automated systems (bots, scripts) to access the service</li>
                <li>Respect intellectual property rights of content providers</li>
                <li>Not misuse or abuse the service in any way</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">4. Third-Party Content</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CineLenz aggregates content from various third-party sources:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>TMDB:</strong> All movie data, images, and metadata are provided by The Movie Database and subject to their terms</li>
                <li><strong>OMDb:</strong> Additional ratings and information from IMDB, Rotten Tomatoes, and Metacritic</li>
                <li><strong>YouTube:</strong> Public comments are analyzed from YouTube's public API</li>
                <li><strong>The Guardian:</strong> Film reviews and articles are sourced from The Guardian's API</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                CineLenz does not own or control this third-party content. All trademarks, service marks, and trade names are the property of their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">5. Accuracy and Availability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We strive to provide accurate and up-to-date information, but:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Information is provided "as is" without warranties of any kind</li>
                <li>We do not guarantee the accuracy, completeness, or reliability of content</li>
                <li>Sentiment analysis is automated and may not reflect nuanced opinions</li>
                <li>Service availability is not guaranteed and may be interrupted</li>
                <li>Third-party APIs may experience outages affecting our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The CineLenz website design, logo, and original content are protected by copyright and other intellectual property laws. Our sentiment analysis algorithms and software are proprietary to CineLenz. You may not copy, modify, distribute, or reverse engineer our platform without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                CineLenz and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service, including but not limited to loss of data, loss of revenue, or cost of substitute services. Our total liability shall not exceed $100 USD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">8. Age Requirements</h2>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 13 years old to use CineLenz. By using the service, you represent that you meet this age requirement. If you are under 18, you should review these terms with a parent or guardian.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">9. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the service at any time without notice. We may also update these Terms of Service periodically. Continued use after changes constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms of Service:
                <br />
                <br />
                <strong>Email:</strong> legal@cinelenz.com
                <br />
                <strong>Website:</strong> <Link href="/" className="text-primary hover:underline">www.cinelenz.com</Link>
              </p>
            </section>

            <div className="bg-card border border-border rounded-lg p-6 mt-8">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> These Terms of Service are part of the agreement between you and CineLenz. Please also review our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
