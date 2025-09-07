"use client"

import { useState, useEffect } from "react"
import { Trophy, Crown, Medal, Users } from "lucide-react"
import Link from "next/link"

// Define the base URL for your backend API
const API_BASE_URL = "http://localhost:4000/api/badges/leaderboard"

// This is the data structure we expect from the backend API
interface TopDonor {
  user: {
    _id: string
    displayName: string
    profilePhoto?: string
  }
  totalAmount: number
  rank: number
}

export default function LeaderboardWidget() {
  // State to hold the list of top donors
  const [topDonors, setTopDonors] = useState<TopDonor[]>([])
  // State to manage the loading status
  const [loading, setLoading] = useState(true)

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    fetchTopDonors()
  }, [])

  const fetchTopDonors = async () => {
    try {
      // API call to the backend's public endpoint for top donors
      const response = await fetch(`${API_BASE_URL}/badges/top`)
      const data = await response.json()
      if (data.success) {
        // Set the state with the top 3 donors from the API response
        setTopDonors(data.top.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching top donors:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  // Show a loading state while fetching data
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render the widget with fetched data
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="h-5 w-5 text-emerald-600 mr-2" />
          Top Donors
        </h3>
        <Link href="/leaderboard" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {topDonors.length === 0 ? (
          <div className="text-center py-4">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No donors yet</p>
          </div>
        ) : (
          topDonors.map((donor) => (
            <div
              key={donor.user._id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">{getRankIcon(donor.rank)}</div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {donor.user.profilePhoto ? (
                  // API call to your backend to get the user's profile photo
                  <img
                    src={`http://localhost:4000/api/image/${donor.user.profilePhoto}`}
                    alt={donor.user.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <Users className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{donor.user.displayName}</p>
                <p className="text-xs text-gray-500">${donor.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}