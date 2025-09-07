"use client"

import { useState, useEffect } from "react"
import { Heart, Calendar, DollarSign, Trash2, BarChart3 } from "lucide-react"

interface Donation {
  id: string
  campaignId: string
  campaignTitle: string
  amount: number
  date: string
  status: string
  anonymous: boolean
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    averageDonation: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonations()
    fetchStats()
  }, [])

  const fetchDonations = async () => {
    try {
      const response = await fetch("/api/users/donations")
      const data = await response.json()
      setDonations(data)
    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/donations/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const deleteDonation = async (donationId: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return

    try {
      await fetch(`/api/donations/${donationId}`, { method: "DELETE" })
      setDonations((prev) => prev.filter((d) => d.id !== donationId))
      fetchStats() // Refresh stats
    } catch (error) {
      console.error("Error deleting donation:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donations</h1>
        <p className="text-gray-600">Track your contributions and impact</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Donated</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalDonated.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Donation</p>
              <p className="text-2xl font-bold text-gray-900">${stats.averageDonation.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Donation History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {donations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Heart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No donations yet</h3>
              <p className="mt-1 text-sm text-gray-500">Start supporting campaigns to see your donations here.</p>
            </div>
          ) : (
            donations.map((donation) => (
              <div key={donation.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{donation.campaignTitle}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(donation.date).toLocaleDateString()}
                      {donation.anonymous && (
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Anonymous</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-emerald-600">${donation.amount.toLocaleString()}</span>
                    <button
                      onClick={() => deleteDonation(donation.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
