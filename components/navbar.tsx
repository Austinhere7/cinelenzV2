"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" aria-label="CineLenz home" className="inline-flex items-center group">
              <span className="text-2xl md:text-3xl font-black font-sans tracking-tight leading-none text-foreground transition-colors duration-200 group-hover:text-foreground">
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
                href="/#examples"
                className="font-sans text-foreground hover:text-primary transition-colors duration-200"
              >
                Examples
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/98 border-t border-border">
              <a
                href="/#how-it-works"
                className="block px-3 py-2 font-sans text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </a>
              <a
                href="/#features"
                className="block px-3 py-2 font-sans text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a
                href="/#examples"
                className="block px-3 py-2 font-sans text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Examples
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
