"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CompanyForm } from "@/components/company-form"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function NewCompanyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    foundedYear: "",
    website: "",
    email: "",
    description: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      industry: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error("Company name is required")
      }

      // Verify logo if website is provided
      let logoVerified = false
      if (formData.website && isValidUrl(`https://${formData.website.replace(/^https?:\/\//, '')}`)) {
        // Use our server-side API to verify the logo (avoids CORS issues)
        try {
          const websiteDomain = formData.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
          const verifyResponse = await fetch(`/api/logo-verify?domain=${encodeURIComponent(websiteDomain)}`)
          const verifyData = await verifyResponse.json()
          
          if (verifyData.success) {
            logoVerified = true
            toast({
              title: "Logo Verification Successful",
              description: "Company logo was successfully verified with Clearbit",
              variant: "default",
            })
          }
        } catch (logoErr) {
          console.error('Logo verification failed:', logoErr)
          // We don't throw here, just continue without verified logo
        }
      }

      // Convert foundedYear to number if provided
      const companyData = {
        ...formData,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
        logoVerified
      }

      // Submit to API
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create company')
      }

      // Show success notification
      toast({
        title: "Save Successful",
        description: "Company was successfully saved to the database",
        variant: "default",
      })

      // Redirect to companies list on success
      router.push('/companies')
      router.refresh()
    } catch (err) {
      console.error('Error creating company:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      
      // Show error notification
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container py-10">
        <div className="mb-6">
          <Button asChild variant="dark-solid" size="sm">
            <Link href="/companies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Link>
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Company</CardTitle>
            <CardDescription className="text-white">
              Fill out the form below to add a new AI company to the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Company Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="AI Innovations Inc."
                    className="bg-gray-900/70 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-white">
                    Industry
                  </Label>
                  <Select value={formData.industry} onValueChange={handleSelectChange}>
                    <SelectTrigger className="bg-gray-900/70 border-gray-700 text-white">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="healthcare">Healthcare AI</SelectItem>
                      <SelectItem value="finance">Finance AI</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, USA"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foundedYear" className="text-white">
                    Founded Year
                  </Label>
                  <Input 
                    id="foundedYear" 
                    value={formData.foundedYear}
                    onChange={handleChange}
                    placeholder="2020" 
                    className="bg-gray-900/70 border-gray-700 text-white" 
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-white">
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="example.com"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Contact Email
                  </Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="info@example.com"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Company Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter a description of the company..."
                  className="min-h-[150px] bg-gray-900/70 border-gray-700 text-white"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Add Company'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
