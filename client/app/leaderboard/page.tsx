"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Crown, Users, Heart, Star } from "lucide-react"
import Link from "next/link"

interface LeaderboardUser {
  id: string
  name: string
  avatar?: string
  totalDonated: number
  donationCount: number
  rank: number
  badge: string
  joinedDate: string
}

interface TopDonor {
  id: string
  name: string
  avatar?: string
  totalDonated: number
  badge: string
}

export default function LeaderboardPage() {
  const [topDonors, setTopDonors] = useState<TopDonor[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [myRank, setMyRank] = useState<{ rank: number; totalDonated: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchLeaderboardData()
  }, [currentPage])

  const fetchLeaderboardData = async () => {
    try {
      const [topResponse, leaderboardResponse, rankResponse] = await Promise.all([
        fetch("/api/badges/top"),
        fetch(`/api/badges/leaderboard?page=${currentPage}`),
        fetch("/api/badges/my-rank").catch(() => null), // Handle unauthenticated users
      ])

      const topData = await topResponse.json()
      const leaderboardData = await leaderboardResponse.json()
      const rankData = rankResponse ? await rankResponse.json() : null

      setTopDonors(topData)
      setLeaderboard(leaderboardData.users || leaderboardData)
      setMyRank(rankData)
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500 animate-pulse" />
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400 animate-pulse" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600 animate-pulse" />
      default:
        return <span className="text-lg font-bold text-primary">#{rank}</span>
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "platinum":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white animate-glow"
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white animate-glow"
      case "silver":
        return "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800 animate-glow"
      case "bronze":
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-white animate-glow"
      default:
        return "bg-gradient-to-r from-primary to-accent text-white animate-glow"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 glass rounded w-1/4 animate-glow"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 glass-card rounded-xl animate-float"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-5xl font-bold gradient-text mb-4 animate-float">Benevo Champions</h1>
          <p className="text-xl text-muted-foreground mb-6 animate-fade-in-scale">
            Celebrating our most generous supporters who make dreams reality
          </p>

          {myRank && (
            <div className="inline-flex items-center glass-card border border-primary/20 rounded-lg px-6 py-3 animate-glow">
              <Trophy className="h-5 w-5 text-primary mr-2 animate-pulse" />
              <span className="text-foreground font-medium">
                Your Rank: #{myRank.rank} | Total Donated: ${myRank.totalDonated.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Top 3 Podium */}
        {topDonors.length >= 3 && (
          <div className="mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold gradient-text mb-6 text-center animate-pulse-glow">Elite Contributors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Second Place */}
              <div className="order-1 md:order-1 animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="glass-card p-6 text-center transform hover:scale-105 transition-all duration-300 hover:animate-glow">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 glass rounded-full mx-auto flex items-center justify-center animate-pulse-glow">
                      {topDonors[1]?.avatar ? (
                        <img
                          src={topDonors[1].avatar || "/placeholder.svg"}
                          alt={topDonors[1].name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Trophy className="h-8 w-8 text-gray-400 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{topDonors[1]?.name}</h3>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getBadgeColor(topDonors[1]?.badge)}`}
                  >
                    {topDonors[1]?.badge} Donor
                  </div>
                  <p className="text-2xl font-bold gradient-text">${topDonors[1]?.totalDonated.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">2nd Place</p>
                </div>
              </div>

              {/* First Place */}
              <div className="order-2 md:order-2 animate-float">
                <div className="glass-card border-2 border-primary/50 p-6 text-center transform hover:scale-105 transition-all duration-300 animate-glow">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 glass rounded-full mx-auto flex items-center justify-center shadow-lg animate-pulse-glow">
                      {topDonors[0]?.avatar ? (
                        <img
                          src={topDonors[0].avatar || "/placeholder.svg"}
                          alt={topDonors[0].name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <div className="absolute -top-3 -right-3">
                      <Crown className="h-10 w-10 text-yellow-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{topDonors[0]?.name}</h3>
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-3 ${getBadgeColor(topDonors[0]?.badge)}`}
                  >
                    {topDonors[0]?.badge} Donor
                  </div>
                  <p className="text-3xl font-bold gradient-text animate-pulse-glow">
                    ${topDonors[0]?.totalDonated.toLocaleString()}
                  </p>
                  <p className="text-sm text-primary font-medium animate-pulse">Champion</p>
                </div>
              </div>

              {/* Third Place */}
              <div className="order-3 md:order-3 animate-float" style={{ animationDelay: "1s" }}>
                <div className="glass-card p-6 text-center transform hover:scale-105 transition-all duration-300 hover:animate-glow">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 glass rounded-full mx-auto flex items-center justify-center animate-pulse-glow">
                      {topDonors[2]?.avatar ? (
                        <img
                          src={topDonors[2].avatar || "/placeholder.svg"}
                          alt={topDonors[2].name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="h-10 w-10 text-primary" />
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Medal className="h-8 w-8 text-amber-600 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{topDonors[2]?.name}</h3>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getBadgeColor(topDonors[2]?.badge)}`}
                  >
                    {topDonors[2]?.badge} Donor
                  </div>
                  <p className="text-2xl font-bold gradient-text">${topDonors[2]?.totalDonated.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">3rd Place</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="glass-card animate-slide-up">
          <div className="px-6 py-4 border-b border-primary/20">
            <h2 className="text-2xl font-semibold gradient-text animate-pulse-glow">Complete Leaderboard</h2>
          </div>
          <div className="divide-y divide-border">
            {leaderboard.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Trophy className="mx-auto h-12 w-12 text-primary animate-float" />
                <h3 className="mt-2 text-sm font-medium text-foreground">No leaderboard data</h3>
                <p className="mt-1 text-sm text-muted-foreground">Be the first to make a donation!</p>
              </div>
            ) : (
              leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className="px-6 py-4 hover:bg-primary/5 transition-all duration-300 hover:animate-pulse-glow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-12 flex justify-center">{getRankIcon(user.rank)}</div>
                      <div className="w-12 h-12 glass rounded-full flex items-center justify-center animate-pulse-glow">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1 text-primary animate-pulse" />
                            {user.donationCount} donations
                          </span>
                          <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getBadgeColor(user.badge)}`}
                      >
                        {user.badge}
                      </div>
                      <p className="text-xl font-bold gradient-text">${user.totalDonated.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {leaderboard.length > 0 && (
          <div className="mt-8 flex justify-center animate-fade-in-scale">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 glass border border-primary/20 rounded-lg hover:animate-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-lg animate-pulse-glow">
                Page {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 glass border border-primary/20 rounded-lg hover:animate-glow transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center glass-card p-8 animate-slide-up">
          <Star className="mx-auto h-12 w-12 text-primary mb-4 animate-float" />
          <h3 className="text-3xl font-bold gradient-text mb-2 animate-pulse-glow">Join the Champions!</h3>
          <p className="text-muted-foreground mb-6 animate-fade-in-scale">
            Make a donation to any campaign and see your name among the elite
          </p>
          <Link
            href="/campaigns"
            className="inline-flex items-center bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 animate-glow"
          >
            <Heart className="mr-2 h-5 w-5 animate-pulse" />
            Browse Campaigns
          </Link>
        </div>
      </div>
    </div>
  )
}
