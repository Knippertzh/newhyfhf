"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function PreRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    reason: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full border-none bg-black/50 backdrop-blur-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">Request Submitted</CardTitle>
          <CardDescription className="text-center text-white">
            Your registration request has been sent to the administrator for review. You will receive an email once your
            account is approved.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild className="text-white">
            <a href="/login">Return to Login</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full border-none bg-black/50 backdrop-blur-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">Request Access</CardTitle>
        <CardDescription className="text-center text-white">
          Fill out the form below to request access to the AI Expert Database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-gray-900/70 border-gray-700 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-900/70 border-gray-700 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company" className="text-white">
                Company/Organization
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="bg-gray-900/70 border-gray-700 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className="text-white">
                Role/Position
              </Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="bg-gray-900/70 border-gray-700 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-white">
                Reason for Access
              </Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="min-h-[100px] bg-gray-900/70 border-gray-700 text-white"
                placeholder="Please explain why you need access to the AI Expert Database"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-medium bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

