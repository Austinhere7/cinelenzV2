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

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Neural Link collects information to provide better services to our users. We collect information in the
                following ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Information you give us directly (account registration, contact forms)</li>
                <li>Neural interface data collected through our brain-computer interface technology</li>
                <li>Usage data and analytics from our applications and services</li>
                <li>Device information and technical specifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">2. Neural Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your neural data is the most sensitive information we handle. We implement the highest security
                standards:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>End-to-end encryption for all neural signal transmission</li>
                <li>Local processing whenever possible to minimize data transmission</li>
                <li>Strict access controls and audit trails for all neural data access</li>
                <li>Regular security assessments and penetration testing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">3. How We Use Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide and improve our neural interface services</li>
                <li>Personalize your experience and optimize neural signal processing</li>
                <li>Conduct research to advance brain-computer interface technology</li>
                <li>Ensure safety and security of our systems</li>
                <li>Comply with legal obligations and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">4. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>With your explicit consent for research participation</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect the rights, property, or safety of Neural Link or others</li>
                <li>With service providers under strict confidentiality agreements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">5. Your Rights and Choices</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access, update, or delete your personal information</li>
                <li>Opt-out of data collection for research purposes</li>
                <li>Request data portability for your neural interface data</li>
                <li>Withdraw consent for data processing at any time</li>
                <li>File complaints with relevant data protection authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">6. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@neurallink.com
                <br />
                Address: Neural Link Corporation, Privacy Office, [Address]
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
