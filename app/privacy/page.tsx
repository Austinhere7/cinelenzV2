import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
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

          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 font-orbitron">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground leading-relaxed">
                CineLenz is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our movie discovery and social sentiment analysis platform.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CineLenz collects information to provide better movie discovery and analysis services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Search and Viewing Data:</strong> Movies you search for, reviews you read, and pages you visit</li>
                <li><strong>Usage Analytics:</strong> How you interact with our features and services</li>
                <li><strong>Device Information:</strong> Browser type, device type, IP address, and operating system</li>
                <li><strong>Cookies:</strong> We use cookies to improve your experience and remember your preferences</li>
                <li><strong>No Personal Accounts:</strong> CineLenz currently does not require account registration or collect personally identifiable information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">2. Third-Party Data Sources</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We aggregate movie information and social media sentiment from various sources:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>TMDB (The Movie Database):</strong> Movie metadata, images, and user ratings</li>
                <li><strong>OMDb:</strong> Additional movie information and ratings from IMDB, Rotten Tomatoes, Metacritic</li>
                <li><strong>YouTube:</strong> Public comments on movie-related videos (analyzed anonymously)</li>
                <li><strong>The Guardian:</strong> Professional film critic reviews and articles</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                All data collected from these sources is publicly available. We do not access private accounts or non-public information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">3. How We Use Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We use collected information to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate movie recommendations and sentiment analysis</li>
                <li>Improve our algorithms and user experience</li>
                <li>Analyze trends in movie popularity and audience reactions</li>
                <li>Debug technical issues and optimize performance</li>
                <li>Understand which features are most valuable to users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">4. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Secure HTTPS connections for all data transmission</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Limited data retention - we only keep analytics data for 90 days</li>
                <li>No storage of sensitive personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CineLenz uses cookies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use the site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can control cookies through your browser settings. See our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link> for details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Clear your browser cookies and local storage at any time</li>
                <li>Opt-out of analytics tracking</li>
                <li>Request information about data we may have collected</li>
                <li>Contact us with privacy concerns or questions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">7. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                CineLenz is not directed to children under 13. We do not knowingly collect information from children under 13 years of age.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our privacy practices:
                <br />
                <br />
                <strong>Email:</strong> privacy@cinelenz.com
                <br />
                <strong>Website:</strong> <Link href="/" className="text-primary hover:underline">www.cinelenz.com</Link>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
