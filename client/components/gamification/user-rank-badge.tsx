"use client"

import { useState, useEffect } from "react"
import { Trophy, TrendingUp } from "lucide-react"

// Define the base URL for your backend API
const API_BASE_URL = "http://localhost:4000/api/badges/rank/:userId"

// This is the data structure we expect from the backend API
interface UserRank {
  rank: number
  totalAmount: number // Correct field name from your backend
  badge: string
  user: {
    _id: string
    displayName: string
    profilePhoto?: string
  }
}

export default function UserRankBadge() {
  // State to hold the user's rank information
  const [userRank, setUserRank] = useState<UserRank | null>(null)
  // State to manage the loading status
  const [loading, setLoading] = useState(true)

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    fetchUserRank()
  }, [])

  const fetchUserRank = async () => {
    try {
      // Get the JWT token from local storage for authentication
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return // Exit if not authenticated
      }
      
      // API call to the backend's protected endpoint for the user's rank
      const response = await fetch(`${API_BASE_URL}/badges/my-rank`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      })
      const data = await response.json()

      if (data.success) {
        // Set the state with the user's rank from the API response
        setUserRank(data)
      } else {
        console.error("Error fetching user rank:", data.message)
      }
    } catch (error) {
      console.error("Error fetching user rank:", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to determine the badge's color
  const getBadgeColor = (badge: string) => {
    switch (badge?.toLowerCase()) {
      case "platinum":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case "silver":
        return "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800"
      case "bronze":
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-white"
      default:
        return "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white"
    }
  }

  // Show nothing if still loading or no rank data is available
  if (loading || !userRank) {
    return null
  }

  // Render the badge with the fetched data
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Trophy className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900">Rank #{userRank.rank}</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(userRank.badge)}`}>
              {userRank.badge}
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <TrendingUp className="h-3 w-3 mr-1" />${userRank.totalAmount.toLocaleString()} donated
          </div>
        </div>
      </div>
    </div>
  )
}