"use client"

import { Award, Star, Heart, Trophy, Crown, Medal } from "lucide-react"

interface AchievementBadgeProps {
  type: "first_donation" | "milestone" | "streak" | "top_donor" | "champion" | "supporter"
  title: string
  description: string
  earned?: boolean
  progress?: number
  maxProgress?: number
}

export default function AchievementBadge({
  type,
  title,
  description,
  earned = false,
  progress = 0,
  maxProgress = 100,
}: AchievementBadgeProps) {
  const getIcon = () => {
    switch (type) {
      case "first_donation":
        return <Heart className="h-6 w-6" />
      case "milestone":
        return <Star className="h-6 w-6" />
      case "streak":
        return <Award className="h-6 w-6" />
      case "top_donor":
        return <Trophy className="h-6 w-6" />
      case "champion":
        return <Crown className="h-6 w-6" />
      case "supporter":
        return <Medal className="h-6 w-6" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  const getColors = () => {
    if (earned) {
      switch (type) {
        case "champion":
          return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-300"
        case "top_donor":
          return "bg-gradient-to-br from-purple-400 to-purple-600 text-white border-purple-300"
        case "milestone":
          return "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-300"
        default:
          return "bg-gradient-to-br from-blue-400 to-blue-600 text-white border-blue-300"
      }
    }
    return "bg-gray-100 text-gray-400 border-gray-200"
  }

  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0

  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${getColors()} ${
        earned ? "shadow-lg transform hover:scale-105" : "opacity-60"
      }`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className={`p-2 rounded-lg ${earned ? "bg-white/20" : "bg-gray-200"}`}>{getIcon()}</div>
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs opacity-90">{description}</p>
        </div>
      </div>

      {!earned && maxProgress > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>
              {progress}/{maxProgress}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {earned && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-green-500 text-white rounded-full p-1">
            <Star className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  )
}
