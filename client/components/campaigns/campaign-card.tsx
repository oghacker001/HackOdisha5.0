"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DonationModal } from "./donation-modal"

interface Campaign {
  id: string
  _id: string
  title: string
  description: string
  funding_goal: number
  collected_amount: number
  backers: number
  daysLeft: number
  categories: string[]
  images: string[]
  organizer: {
    displayName: string
  }
  location?: string
  rewards: { id: string; amount: number; title: string; description: string; estimatedDelivery: string; }[]
}

interface CampaignCardProps {
  campaign: Campaign
  className?: string
}

export function CampaignCard({ campaign, className }: CampaignCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const progressPercentage = (campaign.collected_amount / campaign.funding_goal) * 100

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      // This would call your like API endpoint
      setIsLiked(!isLiked)
    } catch (error) {
      console.error("Error liking campaign:", error)
    }
  }

  const handleDonateClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDonationModalOpen(true)
  }

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${className}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={
            campaign.images && campaign.images.length > 0
              ? `http://localhost:4000/api/image/${campaign.images[0]}`
              : `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(campaign.title + " campaign")}`
          }
          alt={campaign.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {campaign.categories[0]}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 hover:bg-background transition-colors ${
            isLiked ? "text-red-500" : "text-muted-foreground"
          }`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {campaign.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">by {campaign.organizer.displayName}</p>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>

          {campaign.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {campaign.location}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-primary">${campaign.collected_amount.toLocaleString()}</span>
              <span className="text-muted-foreground">of ${campaign.funding_goal.toLocaleString()}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {/* This will need to be fetched from the backend */}
              0 backers
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {/* This will need to be calculated based on the campaign's start date */}
              0 days left
            </div>
          </div>

          <Button
            asChild
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            onClick={handleDonateClick}
          >
            <Link href={`/campaigns/${campaign._id}`}>Back This Project</Link>
          </Button>
        </div>
      </CardContent>
      {isDonationModalOpen && (
        <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} campaign={campaign} />
      )}
    </Card>
  )
}
