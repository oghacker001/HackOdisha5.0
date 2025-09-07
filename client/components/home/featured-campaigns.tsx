"use client"

import { useEffect, useState } from "react"
import { CampaignCard } from "@/components/campaigns/campaign-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

// Define the base URL for your backend API
const API_BASE_URL = "http://localhost:4000/api/admin/campaigns"

// This interface now correctly matches your backend's Campaign model
interface Campaign {
  _id: string
  title: string
  description: string
  funding_goal: number
  collected_amount: number
  category: string
  images: string[]
  organizer: {
    displayName: string
    _id: string
  }
  location?: string
  status: string
  backers?: number
}

export function FeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // This is the API call to your backend's public endpoint for approved campaigns
        const response = await fetch(`${API_BASE_URL}/campaigns`)
        if (response.ok) {
          const data = await response.json()
          // Use the data from your backend
          setCampaigns(data.data.slice(0, 6))
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error)
        // Fallback to mock data for demo in case of an error
        setCampaigns([
          {
            _id: "mock1",
            title: "Revolutionary Solar Panel Technology",
            description: "Next-generation solar panels that are 40% more efficient and cost-effective for everyone.",
            funding_goal: 100000,
            collected_amount: 75000,
            backers: 234, // Note: This field is not in your backend schema, so it will need to be added or handled.
            category: "Technology",
            images: ["placeholder.svg"],
            organizer: { displayName: "GreenTech Innovations", _id: "mockuser1" },
            location: "San Francisco, CA",
            status: "approved",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending Now
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Featured Campaigns</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Discover the most exciting projects that are changing the world, one idea at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {campaigns.map((campaign, index) => (
            <CampaignCard
              key={campaign._id}
              campaign={{
                ...campaign,
                id: campaign._id,
                daysLeft: 30, // Replace with actual calculation if available
                categories: campaign.category ? [campaign.category] : [],
                rewards: [], // Replace with actual rewards if available
                backers: campaign.backers ?? 0,
              }}
              className={`animate-fade-in-up delay-${index * 100}`}
            />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="group bg-transparent" asChild>
            <Link href="/campaigns">
              View All Campaigns
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
