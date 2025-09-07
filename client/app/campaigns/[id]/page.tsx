"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DonationModal } from "@/components/campaigns/donation-modal"
import { Heart, Share2, MapPin, Calendar, Target, MessageCircle, Clock } from "lucide-react"
import { useParams } from "next/navigation"

interface Campaign {
  id: string
  title: string
  description: string
  fullDescription: string
  goal: number
  raised: number
  backers: number
  daysLeft: number
  category: string
  image: string
  organizer: {
    name: string
    avatar: string
    bio: string
    campaignsCount: number
  }
  location?: string
  createdAt: string
  updates: Array<{
    id: string
    title: string
    content: string
    date: string
  }>
  rewards: Array<{
    id: string
    amount: number
    title: string
    description: string
    estimatedDelivery: string
    backers: number
    available: boolean
  }>
}

export default function CampaignDetailPage() {
  const params = useParams()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCampaign(data)
        }
      } catch (error) {
        console.error("Error fetching campaign:", error)
        // Mock data for demo
        setCampaign({
          id: params.id as string,
          title: "Revolutionary Solar Panel Technology",
          description: "Next-generation solar panels that are 40% more efficient and cost-effective for everyone.",
          fullDescription: `Our revolutionary solar panel technology represents a breakthrough in renewable energy. Using advanced photovoltaic cells and innovative materials, we've created panels that are 40% more efficient than traditional solar panels while being 30% more cost-effective.

This technology will make solar energy accessible to millions more households and businesses worldwide, accelerating the transition to clean energy and helping combat climate change.

The funds raised will be used for:
• Final product development and testing
• Setting up manufacturing facilities
• Initial production run
• Marketing and distribution
• Regulatory approvals and certifications`,
          goal: 100000,
          raised: 75000,
          backers: 234,
          daysLeft: 15,
          category: "Technology",
          image: "",
          organizer: {
            name: "GreenTech Innovations",
            avatar: "",
            bio: "Leading renewable energy company focused on making clean energy accessible to everyone.",
            campaignsCount: 3,
          },
          location: "San Francisco, CA",
          createdAt: "2024-01-15",
          updates: [
            {
              id: "1",
              title: "Prototype Testing Complete!",
              content:
                "We've successfully completed all prototype testing with amazing results. Efficiency is even higher than expected!",
              date: "2024-02-20",
            },
            {
              id: "2",
              title: "Manufacturing Partner Secured",
              content: "We've partnered with a leading solar manufacturer to ensure quality production at scale.",
              date: "2024-02-15",
            },
          ],
          rewards: [
            {
              id: "1",
              amount: 25,
              title: "Early Supporter",
              description: "Get updates and a thank you email",
              estimatedDelivery: "March 2024",
              backers: 45,
              available: true,
            },
            {
              id: "2",
              amount: 100,
              title: "Solar Panel Kit",
              description: "One of our revolutionary solar panels for your home",
              estimatedDelivery: "June 2024",
              backers: 89,
              available: true,
            },
            {
              id: "3",
              amount: 500,
              title: "Complete Home System",
              description: "Full solar panel system for average home installation",
              estimatedDelivery: "August 2024",
              backers: 23,
              available: true,
            },
          ],
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchCampaign()
    }
  }, [params.id])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign?.title,
          text: campaign?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleLike = async () => {
    setIsLiked(!isLiked)
    // This would call your like API endpoint
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-muted-foreground">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const progressPercentage = (campaign.raised / campaign.goal) * 100

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <img
            src={
              campaign.image ||
              `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(campaign.title + " campaign hero")}`
            }
            alt={campaign.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/90">
              {campaign.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="secondary" size="sm" className="bg-background/90 hover:bg-background" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current text-red-500" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-background/90 hover:bg-background"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{campaign.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{campaign.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {campaign.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={campaign.organizer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{campaign.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{campaign.organizer.name}</h3>
                    <p className="text-muted-foreground mb-2">{campaign.organizer.bio}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.organizer.campaignsCount} campaigns created
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="updates">Updates ({campaign.updates.length})</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose prose-gray max-w-none">
                      {campaign.fullDescription.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 text-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="mt-6">
                <div className="space-y-4">
                  {campaign.updates.map((update) => (
                    <Card key={update.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold">{update.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{update.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Comments will be available soon!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">${campaign.raised.toLocaleString()}</div>
                    <div className="text-muted-foreground">raised of ${campaign.goal.toLocaleString()} goal</div>
                  </div>

                  <Progress value={progressPercentage} className="h-3" />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{campaign.backers}</div>
                      <div className="text-sm text-muted-foreground">backers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{campaign.daysLeft}</div>
                      <div className="text-sm text-muted-foreground">days left</div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg py-6"
                    onClick={() => setIsDonationModalOpen(true)}
                  >
                    Back This Project
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Support Tiers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {campaign.rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => setIsDonationModalOpen(true)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-primary">${reward.amount}</div>
                        <div className="text-sm text-muted-foreground">{reward.backers} backers</div>
                      </div>
                      <h4 className="font-medium mb-2">{reward.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Estimated delivery: {reward.estimatedDelivery}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} campaign={campaign} />
    </div>
  )
}
