"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, CreditCard, DollarSign } from "lucide-react"

const API_BASE_URL = "http://localhost:4000/api/users/donations"

interface Campaign {
  _id: string
  title: string
  funding_goal: number
  collected_amount: number
}

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: Campaign
}

// Interface for the payload our backend's donation API expects
interface DonationPayload {
  campaignId: string
  amount: number
  message?: string
  paymentMethod: "Card" | "UPI"
}

export function DonationModal({ isOpen, onClose, campaign }: DonationModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("UPI")
  const [donationAmount, setDonationAmount] = useState(0)
  const [message, setMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDonation = async () => {
    setIsProcessing(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Please log in to donate.")
        onClose()
        return
      }

      const donationData: DonationPayload = {
        campaignId: campaign._id,
        amount: donationAmount,
        message,
        paymentMethod: selectedPaymentMethod as "Card" | "UPI",
      }

      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Send the JWT token for authentication
        },
        body: JSON.stringify(donationData),
      })

      const data = await response.json()

      if (data.success) {
        alert("Thank you for your donation! You'll receive a confirmation shortly.")
        onClose()
        window.location.reload() // Refresh to show updated funding
      } else {
        alert(data.message || "Donation failed")
      }
    } catch (error) {
      console.error("Donation error:", error)
      alert("There was an error processing your donation. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!Number.isNaN(value) && value >= 0) {
      setDonationAmount(value)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Heart className="h-5 w-5 mr-2 text-primary" />
            Support: {campaign.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Donation Amount Input */}
          <div className="space-y-2">
            <Label className="text-base font-medium" htmlFor="amount">
              Donation Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="pl-10 h-11"
                value={donationAmount}
                onChange={handleAmountChange}
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Payment Method</Label>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    selectedPaymentMethod === "UPI" ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Label htmlFor="upi" className="flex items-center font-medium">
                    <CreditCard className="h-4 w-4 mr-2" />
                    UPI
                  </Label>
                  <RadioGroupItem value="UPI" id="upi" />
                </Card>
                <Card
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    selectedPaymentMethod === "Card" ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Label htmlFor="card" className="flex items-center font-medium">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Card
                  </Label>
                  <RadioGroupItem value="Card" id="card" />
                </Card>
              </div>
            </RadioGroup>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Leave a message for the campaign creator..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Donation Amount:</span>
                <span className="text-xl font-bold text-primary">${donationAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleDonation}
              disabled={!donationAmount || donationAmount <= 0 || isProcessing}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Donate ${donationAmount.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
