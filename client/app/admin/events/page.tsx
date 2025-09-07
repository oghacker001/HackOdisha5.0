"use client"

import { useState, useEffect } from "react"
import { Check, X, Trash2, Eye, Filter, Search, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: "pending" | "approved" | "rejected"
  organizerName: string
  organizerEmail: string
  createdAt: string
  category: string
  attendees: number
  maxAttendees?: number
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const approveEvent = async (eventId: string) => {
    try {
      await fetch(`/api/admin/events/${eventId}/approve`, { method: "PUT" })
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? { ...event, status: "approved" as const } : event)),
      )
    } catch (error) {
      console.error("Error approving event:", error)
    }
  }

  const rejectEvent = async (eventId: string) => {
    try {
      await fetch(`/api/admin/events/${eventId}/reject`, { method: "PUT" })
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? { ...event, status: "rejected" as const } : event)),
      )
    } catch (error) {
      console.error("Error rejecting event:", error)
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to permanently delete this event?")) return

    try {
      await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" })
      setEvents((prev) => prev.filter((event) => event.id !== eventId))
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

  const filteredEvents = events
    .filter((event) => filter === "all" || event.status === filter)
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizerName.toLowerCase().includes(searchTerm.toLowerCase()),
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
        <p className="text-gray-600">Review and manage all events on the platform</p>
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
              <option value="all">All Events</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events or organizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Events ({filteredEvents.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredEvents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No events found matching your criteria.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                      <div>
                        <span className="font-medium">Attendees:</span> {event.attendees}
                        {event.maxAttendees && ` / ${event.maxAttendees}`}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Organizer:</span> {event.organizerName}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {event.category}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {new Date(event.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/events/${event.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Event"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    {event.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveEvent(event.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Approve Event"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => rejectEvent(event.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Reject Event"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Event"
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
