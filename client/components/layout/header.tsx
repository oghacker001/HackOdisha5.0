"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, User, LogOut, Trophy, Award } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  // The isLoggedIn state is now managed using localStorage to persist across sessions
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  // This is the API base URL that connects your frontend to your backend
  const API_BASE_URL = "http://localhost:4000/"

  // Check for a token in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // The search query is passed as a URL parameter to your backend
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
    try {
      // This fetch call sends a request to your backend's logout endpoint
      await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" })
      
      // After a successful logout, clear local storage and update the state
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      setIsLoggedIn(false)

      // Redirect to the home page
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b glass backdrop-blur-xl animate-slide-up">
      <div className="container mx-auto px-4">
        {/* Logo and Auth Buttons on Sides, Navigation in Center */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center space-x-3 animate-float">
            <div className="relative">
              <Image src="/logo.png" alt="Benevo Logo" width={40} height={40} className="rounded-lg animate-glow" />
            </div>
            <span className="text-2xl font-bold gradient-text animate-pulse-glow">Benevo</span>
          </Link>

          {/* Centered Navigation for Desktop */}
          <nav className="hidden md:flex items-center space-x-12 flex-1 justify-center">
            <Link
              href="/campaigns"
              className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 animate-fade-in-scale"
            >
              Campaigns
            </Link>
            <Link
              href="/events"
              className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 animate-fade-in-scale"
            >
              Events
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 animate-fade-in-scale"
            >
              About
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 flex items-center animate-fade-in-scale"
            >
              <Trophy className="h-4 w-4 mr-1 animate-pulse" />
              Leaderboard
            </Link>
            <Link
              href="/achievements"
              className="text-sm font-medium hover:text-primary transition-all duration-300 hover:scale-105 flex items-center animate-fade-in-scale"
            >
              <Award className="h-4 w-4 mr-1 animate-pulse" />
              Achievements
            </Link>
          </nav>

          {/* Auth Buttons - Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:animate-pulse-glow transition-all duration-300"
                  asChild
                >
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:animate-pulse-glow transition-all duration-300"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:animate-pulse-glow transition-all duration-300"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 animate-glow hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden animate-pulse"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Added Search Bar Below Main Navigation */}
        <div className="hidden md:flex justify-center py-4 border-t border-primary/10 mt-2">
          <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-pulse" />
              <Input
                type="text"
                placeholder="Search campaigns and events..."
                className="pl-10 glass border-primary/20 focus:border-primary/50 transition-all duration-300 focus:animate-glow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 glass-card rounded-lg mt-2 animate-slide-up">
            <form onSubmit={handleSearch} className="flex items-center space-x-2 px-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 glass border-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <nav className="flex flex-col space-y-2 px-4">
              <Link
                href="/campaigns"
                className="text-sm font-medium hover:text-primary transition-all duration-300 py-2 hover:pl-2"
              >
                Campaigns
              </Link>
              <Link
                href="/events"
                className="text-sm font-medium hover:text-primary transition-all duration-300 py-2 hover:pl-2"
              >
                Events
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-primary transition-all duration-300 py-2 hover:pl-2"
              >
                About
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm font-medium hover:text-primary transition-all duration-300 py-2 flex items-center hover:pl-2"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Link>
              <Link
                href="/achievements"
                className="text-sm font-medium hover:text-primary transition-all duration-300 py-2 flex items-center hover:pl-2"
              >
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </Link>
            </nav>

            <div className="flex flex-col space-y-2 pt-4 border-t border-primary/20 px-4">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" size="sm" className="justify-start hover:animate-pulse-glow" asChild>
                    <Link href="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start hover:animate-pulse-glow"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="justify-start hover:animate-pulse-glow" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 animate-glow"
                    asChild
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}