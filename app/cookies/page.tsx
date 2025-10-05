import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CookiePolicy() {
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

          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 font-orbitron">Cookie Policy</h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">1. What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit our
                website. They are widely used to make websites work more efficiently and provide information to website
                owners. Neural Link uses cookies to enhance your browsing experience and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">2. Types of Cookies We Use</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Essential Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable basic functions like
                    page navigation, access to secure areas, and neural interface authentication.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Performance Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies collect information about how visitors use our website, such as which pages are
                    visited most often and if users get error messages. This helps us improve website performance.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Functionality Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies allow the website to remember choices you make and provide enhanced, personalized
                    features for your neural interface experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Analytics Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use analytics cookies to understand how our website is being used and to improve the user
                    experience. These cookies help us analyze website traffic and usage patterns.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">3. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may also use third-party cookies from trusted partners to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide social media features and analyze social media traffic</li>
                <li>Deliver relevant advertisements based on your interests</li>
                <li>Analyze website performance and user behavior</li>
                <li>Enable secure payment processing and fraud prevention</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">4. Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
                <li>Cookie preferences: Use our cookie preference center to customize your settings</li>
                <li>Opt-out tools: Use industry opt-out tools for advertising cookies</li>
                <li>Delete cookies: Clear existing cookies from your browser at any time</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Please note that disabling certain cookies may affect the functionality of our website and your neural
                interface experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">5. Cookie Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>
                  <strong>Session cookies:</strong> Deleted when you close your browser
                </li>
                <li>
                  <strong>Persistent cookies:</strong> Retained for a set period (up to 2 years)
                </li>
                <li>
                  <strong>Neural interface cookies:</strong> Retained for security and safety monitoring
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">6. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                updated policy on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">7. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies, please contact us at:
                <br />
                Email: cookies@neurallink.com
                <br />
                Address: Neural Link Corporation, Data Protection Office, [Address]
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
