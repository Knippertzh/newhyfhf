'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { isValidUrl } from "@/lib/logo-utils"

interface Company {
  _id?: string
  name: string
  industry?: string
  location?: string
  foundedYear?: number
  website: string
  email?: string
  description?: string
  logoVerified?: boolean
}

interface CompanyFormProps {
  company?: Company
  onSubmit: (data: Company, logoVerified: boolean) => Promise<void>
  isLoading?: boolean
}

export function CompanyForm({ company, onSubmit, isLoading = false }: CompanyFormProps) {
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Company>({
    name: company?.name || "",
    industry: company?.industry || "",
    location: company?.location || "",
    foundedYear: company?.foundedYear || undefined,
    website: company?.website || "",
    email: company?.email || "",
    description: company?.description || ""
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
    setError(null)

    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error("Company name is required")
      }
      
      if (!formData.website) {
        throw new Error("Website is required")
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
        foundedYear: formData.foundedYear ? parseInt(String(formData.foundedYear)) : undefined,
      }

      await onSubmit(companyData, logoVerified)
    } catch (err) {
      console.error('Error submitting company:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      
      // Show error notification
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      })
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded p-3 mb-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
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
            value={formData.foundedYear || ''}
            onChange={handleChange}
            placeholder="2020" 
            className="bg-gray-900/70 border-gray-700 text-white" 
            type="number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-white">
            Website *
          </Label>
          <Input
            id="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="example.com"
            className="bg-gray-900/70 border-gray-700 text-white"
            required
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
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : company?._id ? 'Update Company' : 'Add Company'}
        </Button>
      </div>
    </form>
  )
}