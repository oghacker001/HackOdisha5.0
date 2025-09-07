"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-accent/10 py-20 md:py-32">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in-up">
            <Zap className="h-4 w-4 mr-2" />
            Join 50,000+ creators funding their dreams
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance animate-fade-in-up delay-200">
            Fund the{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Future
            </span>
            <br />
            You Believe In
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance animate-fade-in-up delay-400">
            Discover groundbreaking projects, support innovative creators, and be part of something extraordinary.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-600">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 h-auto group"
              asChild
            >
              <Link href="/campaigns">
                Explore Projects
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto group bg-transparent" asChild>
              <Link href="/register">
                <Play className="mr-2 h-5 w-5" />
                Start Your Campaign
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 animate-fade-in-up delay-800">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">$2.5M+</div>
              <div className="text-muted-foreground">Successfully Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-muted-foreground">Projects Launched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Backers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
