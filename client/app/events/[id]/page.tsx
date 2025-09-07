"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock, Users, Share2, Heart, Ticket, Info } from "lucide-react"
import { useParams } from "next/navigation"

interface Event {
  id: string
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  location: string
  category: string
  image: string
  organizer: {
    name: string
    avatar: string
    bio: string
  }
  attendees: number
  maxAttendees: number
  price: number
  isFree: boolean
}

export default function EventDetailPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setEvent(data)
        }
      } catch (error) {
        console.error("Error fetching event:", error)
        // Mock data for demo
        setEvent({
          id: params.id as string,
          title: "Tech Innovation Summit 2024",
          description: "Join industry leaders and innovators for a day of inspiring talks and networking.",
          fullDescription: `The Tech Innovation Summit 2024 brings together the brightest minds in technology to share insights, showcase groundbreaking innovations, and explore the future of tech.

This full-day event features:
• Keynote presentations from industry leaders
• Panel discussions on emerging technologies
• Networking opportunities with fellow innovators
• Startup pitch competitions
• Interactive workshops and demos
• Exclusive access to cutting-edge products

Whether you're an entrepreneur, developer, investor, or tech enthusiast, this summit offers valuable insights and connections that will help shape your future in technology.`,
          date: "2024-03-15",
          time: "09:00 AM - 06:00 PM",
          location: "San Francisco Convention Center, CA",
          category: "Technology",
          image: "",
          organizer: {
            name: "TechEvents Inc.",
            avatar: "",
            bio: "Leading organizer of technology conferences and innovation events worldwide.",
          },
          attendees: 245,
          maxAttendees: 500,
          price: 99,
          isFree: false,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const handleRegister = async () => {
    try {
      // This would integrate with your event registration API
      setIsRegistered(true)
      alert("Successfully registered for the event! You'll receive a confirmation email shortly.")
    } catch (error) {
      console.error("Registration error:", error)
      alert("There was an error registering for the event. Please try again.")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleLike = async () => {
    setIsLiked(!isLiked)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded" />
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const spotsLeft = event.maxAttendees - event.attendees

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <img
            src={
              event.image || `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(event.title + " event")}`
            }
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/90">
              {event.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="secondary" size="sm" className="bg-background/90 hover:bg-background" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current text-red-500" : ""}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-background/90 hover:bg-background"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{event.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{event.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{event.organizer.name}</h3>
                    <p className="text-muted-foreground">{event.organizer.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  {event.fullDescription.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {event.isFree ? "FREE" : `$${event.price}`}
                    </div>
                    {!event.isFree && <div className="text-muted-foreground text-sm">per ticket</div>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{event.attendees}</div>
                      <div className="text-sm text-muted-foreground">attending</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{spotsLeft}</div>
                      <div className="text-sm text-muted-foreground">spots left</div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg py-6"
                    onClick={handleRegister}
                    disabled={isRegistered || spotsLeft <= 0}
                  >
                    {isRegistered ? (
                      <>
                        <Ticket className="h-5 w-5 mr-2" />
                        Registered
                      </>
                    ) : spotsLeft <= 0 ? (
                      "Event Full"
                    ) : (
                      <>
                        <Ticket className="h-5 w-5 mr-2" />
                        Register Now
                      </>
                    )}
                  </Button>

                  {spotsLeft <= 10 && spotsLeft > 0 && (
                    <p className="text-sm text-orange-600 text-center">Only {spotsLeft} spots remaining!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Date & Time</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Capacity</div>
                    <div className="text-sm text-muted-foreground">
                      {event.attendees} / {event.maxAttendees} attendees
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
