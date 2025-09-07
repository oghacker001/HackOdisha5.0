import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Target, Zap, Globe, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 animate-gradient" />
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-float mb-8">
            <Image
              src="/logo.png"
              alt="Benevo Logo"
              width={120}
              height={120}
              className="mx-auto animate-glow rounded-2xl"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6 animate-slide-up">About Benevo</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-scale">
            Revolutionizing crowdfunding with cutting-edge technology, transparent processes, and a community-driven
            approach to making dreams reality.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <Badge className="mb-4 animate-pulse-glow">Our Mission</Badge>
              <h2 className="text-4xl font-bold mb-6 gradient-text">Empowering Innovation Through Community</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Benevo is more than just a crowdfunding platform. We're building a revolutionary ecosystem where
                innovative ideas meet passionate supporters, creating a bridge between dreams and reality through the
                power of collective funding.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform leverages advanced technology, gamification, and social features to create the most
                engaging and transparent crowdfunding experience ever built.
              </p>
            </div>
            <div className="glass-card p-8 animate-float">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Passion-Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Every project is fueled by genuine passion and purpose
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Community First</h3>
                  <p className="text-sm text-muted-foreground">
                    Building strong connections between creators and backers
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Goal-Oriented</h3>
                  <p className="text-sm text-muted-foreground">Focused on achieving measurable impact and success</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Cutting-edge features and seamless user experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 animate-pulse-glow">Platform Features</Badge>
            <h2 className="text-4xl font-bold gradient-text mb-6">Why Choose Benevo?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of crowdfunding with our innovative features designed for creators and backers
              alike.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card animate-fade-in-scale hover:animate-glow transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4 animate-pulse" />
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Connect with supporters worldwide and expand your project's impact across borders.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card animate-fade-in-scale hover:animate-glow transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4 animate-pulse" />
                <CardTitle>Secure & Transparent</CardTitle>
                <CardDescription>
                  Advanced security measures and complete transparency in all transactions and project updates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card animate-fade-in-scale hover:animate-glow transition-all duration-300 hover:scale-105">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mb-4 animate-pulse" />
                <CardTitle>Gamified Experience</CardTitle>
                <CardDescription>
                  Earn badges, climb leaderboards, and unlock achievements as you support amazing projects.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-12 text-center animate-slide-up">
            <h2 className="text-3xl font-bold gradient-text mb-12">Our Impact So Far</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="animate-float">
                <div className="text-4xl font-bold text-primary mb-2 animate-pulse-glow">1000+</div>
                <div className="text-muted-foreground">Projects Funded</div>
              </div>
              <div className="animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="text-4xl font-bold text-primary mb-2 animate-pulse-glow">$5M+</div>
                <div className="text-muted-foreground">Total Raised</div>
              </div>
              <div className="animate-float" style={{ animationDelay: "1s" }}>
                <div className="text-4xl font-bold text-primary mb-2 animate-pulse-glow">50K+</div>
                <div className="text-muted-foreground">Active Backers</div>
              </div>
              <div className="animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="text-4xl font-bold text-primary mb-2 animate-pulse-glow">95%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold gradient-text mb-6 animate-slide-up">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-scale">
            Join thousands of creators and backers who are already making their dreams come true on Benevo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 animate-glow hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/register">Start Your Project</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 animate-pulse-glow hover:scale-105 transition-all duration-300 bg-transparent"
              asChild
            >
              <Link href="/campaigns">Explore Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
