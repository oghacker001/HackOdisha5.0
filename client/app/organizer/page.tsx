"use client"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, Users, Calendar, DollarSign, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Campaign {
  id: string
  title: string
  description: string
  goal: number
  raised: number
  status: "pending" | "approved" | "rejected"
  createdAt: string
  endDate: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: "pending" | "approved" | "rejected"
  attendees: number
  createdAt: string
}

export default function OrganizerDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"campaigns" | "events">("campaigns")

  useEffect(() => {
    fetchCampaigns()
    fetchEvents()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/organizer/campaigns")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/organizer/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return

    try {
      await fetch(`/api/organizer/campaigns/${campaignId}`, { method: "DELETE" })
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId))
    } catch (error) {
      console.error("Error deleting campaign:", error)
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      await fetch(`/api/organizer/events/${eventId}`, { method: "DELETE" })
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (error) {
      console.error("Error deleting event:", error)
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

  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0)
  const totalGoal = campaigns.reduce((sum, campaign) => sum + campaign.goal, 0)
  const approvedCampaigns = campaigns.filter((c) => c.status === "approved").length
  const approvedEvents = events.filter((e) => e.status === "approved").length

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Organizer Dashboard</h1>
        <p className="text-gray-600">Manage your campaigns and events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">${totalRaised.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{approvedEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <Link
          href="/organizer/campaigns/create"
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Campaign
        </Link>
        <Link
          href="/organizer/events/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "campaigns"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Campaigns ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Events ({events.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "campaigns" ? (
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first campaign.</p>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                          >
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Goal: ${campaign.goal.toLocaleString()}</span>
                          <span>Raised: ${campaign.raised.toLocaleString()}</span>
                          <span>
                            Progress: {campaign.goal > 0 ? Math.round((campaign.raised / campaign.goal) * 100) : 0}%
                          </span>
                          <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {campaign.status === "pending" && (
                          <Link
                            href={`/organizer/campaigns/${campaign.id}/edit`}
                            className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        )}
                        {campaign.status === "pending" && (
                          <button
                            onClick={() => deleteCampaign(campaign.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No events yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first event.</p>
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                          >
                            {event.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                          <span>Location: {event.location}</span>
                          <span>Attendees: {event.attendees}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          href={`/events/${event.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {event.status === "pending" && (
                          <Link
                            href={`/organizer/events/${event.id}/edit`}
                            className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        )}
                        {event.status === "pending" && (
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
