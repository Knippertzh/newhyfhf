"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CompanyCard } from "@/components/company-card"

import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background"

import { useEffect, useState } from "react"

// Define the Company type
type Company = {
  _id: string
  name: string
  description: string
  industry: string
  location?: string
  website?: string
  headquarters?: string
  expertCount?: number
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch companies from the API
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/companies')
        
        if (!response.ok) {
          throw new Error('Failed to fetch companies')
        }
        
        const data = await response.json()
        setCompanies(data)
      } catch (err) {
        console.error('Error fetching companies:', err)
        setError('Failed to load companies. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <PageBackground intensity="low" color="#00a3ff" />
      <Navbar />
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">AI Companies</h1>
          <Button asChild className="bg-purple-600 text-white hover:bg-purple-700">
            <Link href="/companies/new">Add Company</Link>
          </Button>
        </div>

        <Card className="mb-8 bg-gray-900/70 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Search Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Search by name" className="bg-gray-900/70 border-gray-700 text-white" />
              <Input placeholder="Filter by industry" className="bg-gray-900/70 border-gray-700 text-white" />
              <Button className="bg-purple-600 text-white hover:bg-purple-700">Search</Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-white">Loading companies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white">No companies found. Add a company to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard 
                key={company._id} 
                company={{
                  id: company._id,
                  name: company.name,
                  description: company.description,
                  industry: company.industry,
                  location: company.location || company.headquarters || 'Unknown',
                  website: company.website,
                  expertCount: company.expertCount || 0
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
