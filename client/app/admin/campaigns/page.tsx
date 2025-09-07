"use client"

import { useState, useEffect } from "react"
import { Check, X, Trash2, Eye, Filter, Search } from "lucide-react"
import Link from "next/link"

interface Campaign {
  id: string
  title: string
  description: string
  goal: number
  raised: number
  status: "pending" | "approved" | "rejected"
  organizerName: string
  organizerEmail: string
  createdAt: string
  endDate: string
  category: string
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/admin/campaigns")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const approveCampaign = async (campaignId: string) => {
    try {
      await fetch(`/api/admin/campaigns/${campaignId}/approve`, { method: "PUT" })
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === campaignId ? { ...campaign, status: "approved" as const } : campaign)),
      )
    } catch (error) {
      console.error("Error approving campaign:", error)
    }
  }

  const rejectCampaign = async (campaignId: string) => {
    try {
      await fetch(`/api/admin/campaigns/${campaignId}/reject`, { method: "PUT" })
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === campaignId ? { ...campaign, status: "rejected" as const } : campaign)),
      )
    } catch (error) {
      console.error("Error rejecting campaign:", error)
    }
  }

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to permanently delete this campaign?")) return

    try {
      await fetch(`/api/admin/campaigns/${campaignId}`, { method: "DELETE" })
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId))
    } catch (error) {
      console.error("Error deleting campaign:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCampaigns = campaigns
    .filter((campaign) => filter === "all" || campaign.status === filter)
    .filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.organizerName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Management</h1>
        <p className="text-gray-600">Review and manage all campaigns on the platform</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Campaigns</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns or organizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Campaigns ({filteredCampaigns.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredCampaigns.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No campaigns found matching your criteria.</p>
            </div>
          ) : (
            filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Organizer:</span> {campaign.organizerName}
                      </div>
                      <div>
                        <span className="font-medium">Goal:</span> ${campaign.goal.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Raised:</span> ${campaign.raised.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {campaign.category}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Created: {new Date(campaign.createdAt).toLocaleDateString()} | Ends:{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Campaign"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    {campaign.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveCampaign(campaign.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Approve Campaign"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => rejectCampaign(campaign.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Reject Campaign"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Campaign"
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
