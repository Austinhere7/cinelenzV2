"use client"

import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  return (
    <footer className={`${isLandingPage ? 'bg-black' : 'bg-background'} border-t border-border`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-orbitron text-2xl font-bold text-foreground mb-4">
              Cine<span className="text-primary">Lenz</span>
            </h2>
            <p className="font-space-mono text-muted-foreground mb-6 max-w-md">
              See cinema through the social lens: real-time threads, sentiment, and trends across platforms.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-orbitron text-foreground font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#how-it-works"
                  className="font-space-mono text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="font-space-mono text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#examples"
                  className="font-space-mono text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-orbitron text-foreground font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="font-space-mono text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-space-mono text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="font-space-mono text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-space-mono text-muted-foreground text-sm">© 2025 CineLenz. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="font-space-mono text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="font-space-mono text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="font-space-mono text-muted-foreground hover:text-primary text-sm transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
