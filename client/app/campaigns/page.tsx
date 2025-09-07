"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { CampaignCard } from "@/components/campaigns/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface Campaign {
  id: string
  title: string
  description: string
  goal: number
  raised: number
  backers: number
  daysLeft: number
  category: string
  image: string
  organizer: string
  location?: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("trending")

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("/api/campaigns")
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data)
          setFilteredCampaigns(data)
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error)
        // Mock data for demo
        const mockCampaigns = [
          {
            id: "1",
            title: "Revolutionary Solar Panel Technology",
            description: "Next-generation solar panels that are 40% more efficient and cost-effective for everyone.",
            goal: 100000,
            raised: 75000,
            backers: 234,
            daysLeft: 15,
            category: "Technology",
            image: "",
            organizer: "GreenTech Innovations",
            location: "San Francisco, CA",
          },
          {
            id: "2",
            title: "Community Garden Initiative",
            description:
              "Building sustainable community gardens to provide fresh food and bring neighborhoods together.",
            goal: 25000,
            raised: 18500,
            backers: 156,
            daysLeft: 22,
            category: "Community",
            image: "",
            organizer: "Local Harvest",
            location: "Portland, OR",
          },
          {
            id: "3",
            title: "Educational App for Kids",
            description: "Interactive learning app that makes math and science fun for children aged 6-12.",
            goal: 50000,
            raised: 32000,
            backers: 189,
            daysLeft: 8,
            category: "Education",
            image: "",
            organizer: "EduPlay Studios",
            location: "Austin, TX",
          },
          {
            id: "4",
            title: "Sustainable Fashion Brand",
            description: "Eco-friendly clothing made from recycled materials with zero waste production.",
            goal: 75000,
            raised: 45000,
            backers: 298,
            daysLeft: 30,
            category: "Fashion",
            image: "",
            organizer: "EcoWear Co.",
            location: "New York, NY",
          },
        ]
        setCampaigns(mockCampaigns)
        setFilteredCampaigns(mockCampaigns)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  useEffect(() => {
    let filtered = campaigns

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.organizer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((campaign) => campaign.category === selectedCategory)
    }

    // Sort campaigns
    switch (sortBy) {
      case "trending":
        filtered.sort((a, b) => b.raised / b.goal - a.raised / a.goal)
        break
      case "newest":
        filtered.sort((a, b) => b.daysLeft - a.daysLeft)
        break
      case "ending":
        filtered.sort((a, b) => a.daysLeft - b.daysLeft)
        break
      case "funded":
        filtered.sort((a, b) => b.raised - a.raised)
        break
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, searchQuery, selectedCategory, sortBy])

  const categories = ["Technology", "Community", "Education", "Fashion", "Health", "Arts"]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Amazing Campaigns</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse through thousands of innovative projects and find the ones that inspire you.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="ending">Ending Soon</SelectItem>
              <SelectItem value="funded">Most Funded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">{filteredCampaigns.length} campaigns found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  className={`animate-fade-in-up delay-${(index % 6) * 100}`}
                />
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No campaigns found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSortBy("trending")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
