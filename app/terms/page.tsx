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

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using Neural Link's services, including our brain-computer interface technology, you
                agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree
                with any of these terms, you are prohibited from using our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">2. Medical Device Disclaimer</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Neural Link technology is an experimental medical device. By using our services, you acknowledge:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>The technology is investigational and may carry unknown risks</li>
                <li>You have received proper medical consultation and clearance</li>
                <li>You understand the potential benefits and risks of brain-computer interfaces</li>
                <li>You consent to participate in ongoing clinical studies and monitoring</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">3. User Responsibilities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">As a user of Neural Link services, you agree to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Follow all medical protocols and safety guidelines</li>
                <li>Attend regular check-ups and monitoring appointments</li>
                <li>Report any adverse effects or technical issues immediately</li>
                <li>Not attempt to modify or tamper with the neural interface device</li>
                <li>Use the technology only for approved applications and purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">4. Prohibited Uses</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You may not use Neural Link services to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Engage in any illegal or unauthorized activities</li>
                <li>Attempt to hack, reverse engineer, or compromise our systems</li>
                <li>Share access credentials or allow unauthorized use of your device</li>
                <li>Use the technology in ways that could harm yourself or others</li>
                <li>Violate any applicable laws, regulations, or ethical guidelines</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">5. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                Neural Link shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of our services. Our total liability shall not exceed the amount paid by
                you for the services in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">6. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We may terminate or suspend your access to our services immediately, without prior notice, for any
                reason, including breach of these Terms of Service or if we reasonably believe termination is necessary
                for safety or medical reasons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary font-display">7. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about these Terms of Service, contact us at:
                <br />
                Email: legal@neurallink.com
                <br />
                Address: Neural Link Corporation, Legal Department, [Address]
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
