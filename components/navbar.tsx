"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" aria-label="CineLenz home" className="inline-flex items-center group -gap-4">
              <img 
                src="/new-logo.png?v=2" 
                alt="CineLenz Logo" 
                className="h-30 w-auto md:h-36 object-contain -mr-9"
                style={{ display: 'block' }}
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-3xl md:text-4xl font-black font-sans tracking-tight leading-none text-foreground transition-colors duration-200 group-hover:text-foreground">
                Cine<span className="text-primary">Lenz</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="/#how-it-works"
                className="font-sans text-foreground hover:text-primary transition-colors duration-200"
              >
                How It Works
              </a>
              <a
                href="/#features"
                className="font-sans text-foreground hover:text-primary transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="/get-started#films"
                className="font-sans text-foreground hover:text-primary transition-colors duration-200"
              >
                Films
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-1 pb-2 space-y-0.5 bg-background/98 border-t border-border">
              <a
                href="/#how-it-works"
                className="block px-3 py-1.5 font-sans text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </a>
              <a
                href="/#features"
                className="block px-3 py-1.5 font-sans text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a
                href="/get-started#films"
                className="block px-3 py-1.5 font-sans text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Films
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
