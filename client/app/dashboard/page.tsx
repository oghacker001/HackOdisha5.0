"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  DollarSign,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Settings,
  Camera,
  Edit3,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  joinedDate: string
  totalDonated: number
  campaignsSupported: number
  rank: number
}

interface DonationStats {
  totalDonated: number
  donationsCount: number
  averageDonation: number
  topCategory: string
}

interface Donation {
  id: string
  amount: number
  date: string
  campaign: {
    id: string
    title: string
    image: string
    organizer: string
  }
  message?: string
}

export default function UserDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState<DonationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch("/api/users/profile")
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfile(profileData)
        }

        // Fetch user donations
        const donationsResponse = await fetch("/api/users/donations")
        if (donationsResponse.ok) {
          const donationsData = await donationsResponse.json()
          setDonations(donationsData)
        }

        // Fetch donation stats
        const statsResponse = await fetch("/api/donations/stats")
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        // Mock data for demo
        setProfile({
          id: "1",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "",
          bio: "Passionate supporter of innovative projects and sustainable technology.",
          location: "San Francisco, CA",
          joinedDate: "2023-06-15",
          totalDonated: 1250,
          campaignsSupported: 8,
          rank: 42,
        })

        setStats({
          totalDonated: 1250,
          donationsCount: 12,
          averageDonation: 104,
          topCategory: "Technology",
        })

        setDonations([
          {
            id: "1",
            amount: 100,
            date: "2024-02-20",
            campaign: {
              id: "1",
              title: "Revolutionary Solar Panel Technology",
              image: "",
              organizer: "GreenTech Innovations",
            },
            message: "Great project! Looking forward to the results.",
          },
          {
            id: "2",
            amount: 50,
            date: "2024-02-15",
            campaign: {
              id: "2",
              title: "Community Garden Initiative",
              image: "",
              organizer: "Local Harvest",
            },
          },
          {
            id: "3",
            amount: 200,
            date: "2024-02-10",
            campaign: {
              id: "3",
              title: "Educational App for Kids",
              image: "",
              organizer: "EduPlay Studios",
            },
            message: "Education is so important!",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg" />
              ))}
            </div>
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground">Please log in to view your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0" asChild>
                  <Link href="/dashboard/profile">
                    <Camera className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <p className="text-muted-foreground">{profile.email}</p>
                    {profile.bio && <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                      {profile.location && <span>• {profile.location}</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/profile">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Donated</p>
                  <p className="text-2xl font-bold text-primary">${stats?.totalDonated.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Campaigns Supported</p>
                  <p className="text-2xl font-bold text-primary">{profile.campaignsSupported}</p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Donation</p>
                  <p className="text-2xl font-bold text-primary">${stats?.averageDonation}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Community Rank</p>
                  <p className="text-2xl font-bold text-primary">#{profile.rank}</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="donations">Donation History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Your Donations ({donations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={
                          donation.campaign.image ||
                          `/placeholder.svg?height=60&width=60&query=${encodeURIComponent(donation.campaign.title)}`
                        }
                        alt={donation.campaign.title}
                        className="w-15 h-15 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium hover:text-primary transition-colors">
                              <Link href={`/campaigns/${donation.campaign.id}`}>{donation.campaign.title}</Link>
                            </h3>
                            <p className="text-sm text-muted-foreground">by {donation.campaign.organizer}</p>
                            {donation.message && (
                              <p className="text-sm text-muted-foreground mt-1 italic">"{donation.message}"</p>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-primary">${donation.amount}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(donation.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/campaigns/${donation.campaign.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {donations.length === 0 && (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">You haven't made any donations yet.</p>
                      <Button asChild>
                        <Link href="/campaigns">Explore Campaigns</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">First Donation</h3>
                      <p className="text-sm text-muted-foreground">Made your first contribution</p>
                      <Badge variant="secondary" className="mt-1">
                        Unlocked
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Generous Supporter</h3>
                      <p className="text-sm text-muted-foreground">Donated over $1,000</p>
                      <Badge variant="secondary" className="mt-1">
                        Unlocked
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border rounded-lg opacity-50">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Award className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">Top Supporter</h3>
                      <p className="text-sm text-muted-foreground">Reach top 10 in leaderboard</p>
                      <Badge variant="outline" className="mt-1">
                        Locked
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 border rounded-lg opacity-50">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">Campaign Champion</h3>
                      <p className="text-sm text-muted-foreground">Support 20 different campaigns</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={(profile.campaignsSupported / 20) * 100} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{profile.campaignsSupported}/20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Donated $100</span> to Revolutionary Solar Panel Technology
                      </p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Liked</span> Community Garden Initiative
                      </p>
                      <p className="text-xs text-muted-foreground">5 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Donated $50</span> to Community Garden Initiative
                      </p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
