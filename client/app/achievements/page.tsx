"use client"

import { useState, useEffect } from "react"
import { Trophy, Star, Target, TrendingUp } from "lucide-react"
import AchievementBadge from "@/components/gamification/achievement-badge"

interface Achievement {
  id: string
  type: "first_donation" | "milestone" | "streak" | "top_donor" | "champion" | "supporter"
  title: string
  description: string
  earned: boolean
  earnedDate?: string
  progress?: number
  maxProgress?: number
}

interface UserStats {
  totalDonated: number
  donationCount: number
  currentStreak: number
  rank: number
  achievementsEarned: number
  totalAchievements: number
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const mockAchievements: Achievement[] = [
        {
          id: "1",
          type: "first_donation",
          title: "Benevo Beginner",
          description: "Welcome to the community! Make your first donation",
          earned: true,
          earnedDate: "2024-01-15",
        },
        {
          id: "2",
          type: "milestone",
          title: "Generous Soul",
          description: "Show your commitment with $100+ in donations",
          earned: true,
          earnedDate: "2024-02-01",
        },
        {
          id: "3",
          type: "milestone",
          title: "Impact Maker",
          description: "Create significant change with $500+ donated",
          earned: false,
          progress: 250,
          maxProgress: 500,
        },
        {
          id: "4",
          type: "streak",
          title: "Loyal Champion",
          description: "Maintain your giving streak for 5 consecutive months",
          earned: false,
          progress: 3,
          maxProgress: 5,
        },
        {
          id: "5",
          type: "supporter",
          title: "Community Builder",
          description: "Support 10 different campaigns and spread the love",
          earned: false,
          progress: 7,
          maxProgress: 10,
        },
        {
          id: "6",
          type: "top_donor",
          title: "Elite Benefactor",
          description: "Join the prestigious top 10 donors on Benevo",
          earned: false,
          progress: 15,
          maxProgress: 10,
        },
      ]

      const mockStats: UserStats = {
        totalDonated: 350,
        donationCount: 12,
        currentStreak: 3,
        rank: 15,
        achievementsEarned: 2,
        totalAchievements: 6,
      }

      setAchievements(mockAchievements)
      setUserStats(mockStats)
    } catch (error) {
      console.error("Error fetching achievements:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 glass rounded w-1/4 animate-glow"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 glass-card rounded-xl animate-float"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const earnedAchievements = achievements.filter((a) => a.earned)
  const unearned = achievements.filter((a) => !a.earned)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-5xl font-bold gradient-text mb-4 animate-float">Your Achievements</h1>
          <p className="text-xl text-muted-foreground animate-fade-in-scale">
            Track your impact and unlock exclusive badges on your Benevo journey
          </p>
        </div>

        {/* Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
            <div className="glass-card p-6 animate-float">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg animate-glow">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold gradient-text">
                    {userStats.achievementsEarned}/{userStats.totalAchievements}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 animate-float" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg animate-glow">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Leaderboard Rank</p>
                  <p className="text-2xl font-bold gradient-text">#{userStats.rank}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 animate-float" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg animate-glow">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold gradient-text">{userStats.currentStreak} months</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 animate-float" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-lg animate-glow">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Donated</p>
                  <p className="text-2xl font-bold gradient-text">${userStats.totalDonated}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {userStats && (
          <div className="glass-card p-6 mb-8 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold gradient-text animate-pulse-glow">Overall Progress</h2>
              <span className="text-sm text-muted-foreground animate-pulse">
                {Math.round((userStats.achievementsEarned / userStats.totalAchievements) * 100)}% Complete
              </span>
            </div>
            <div className="w-full glass rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-accent h-4 rounded-full transition-all duration-1000 animate-glow"
                style={{
                  width: `${(userStats.achievementsEarned / userStats.totalAchievements) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <h2 className="text-3xl font-bold gradient-text mb-6 animate-pulse-glow">Earned Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedAchievements.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className="animate-fade-in-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AchievementBadge
                    type={achievement.type}
                    title={achievement.title}
                    description={achievement.description}
                    earned={achievement.earned}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In Progress Achievements */}
        {unearned.length > 0 && (
          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold gradient-text mb-6 animate-pulse-glow">In Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unearned.map((achievement, index) => (
                <div
                  key={achievement.id}
                  className="animate-fade-in-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AchievementBadge
                    type={achievement.type}
                    title={achievement.title}
                    description={achievement.description}
                    earned={achievement.earned}
                    progress={achievement.progress}
                    maxProgress={achievement.maxProgress}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational CTA */}
        <div className="mt-12 text-center glass-card p-8 animate-slide-up">
          <Trophy className="mx-auto h-16 w-16 text-primary mb-4 animate-float" />
          <h3 className="text-3xl font-bold gradient-text mb-4 animate-pulse-glow">Keep Making Impact!</h3>
          <p className="text-muted-foreground mb-6 text-lg animate-fade-in-scale">
            Every donation brings you closer to unlocking new achievements and making a bigger difference in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg hover:scale-105 transition-all duration-300 animate-glow">
              Explore Campaigns
            </button>
            <button className="glass border border-primary/50 text-primary px-8 py-3 rounded-lg hover:scale-105 transition-all duration-300 hover:animate-glow">
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
