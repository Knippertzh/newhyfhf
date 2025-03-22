import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CompanyCard } from "@/components/company-card"
import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background"

// Enhanced mock data with more realistic information
const mockCompanies = [
  {
    id: "1",
    name: "DeepMind",
    description: "AI research lab focused on developing artificial general intelligence",
    industry: "Research",
    location: "London, UK",
    website: "deepmind.com",
    expertCount: 12,
  },
  {
    id: "2",
    name: "OpenAI",
    description: "AI research and deployment company focused on ensuring AGI benefits all of humanity",
    industry: "Research & Products",
    location: "San Francisco, USA",
    website: "openai.com",
    expertCount: 18,
  },
  {
    id: "3",
    name: "Google AI",
    description: "Google's AI division focused on research and applications",
    industry: "Research & Products",
    location: "Mountain View, USA",
    website: "ai.google",
    expertCount: 24,
  },
  {
    id: "4",
    name: "Microsoft Research",
    description: "Microsoft's research division with a strong focus on AI and machine learning",
    industry: "Research & Products",
    location: "Redmond, USA",
    website: "microsoft.com/research",
    expertCount: 15,
  },
  {
    id: "5",
    name: "Meta AI",
    description: "Meta's AI research lab working on advancing artificial intelligence",
    industry: "Research",
    location: "Menlo Park, USA",
    website: "ai.meta.com",
    expertCount: 20,
  },
  {
    id: "6",
    name: "Anthropic",
    description: "AI safety company working to build reliable, interpretable, and steerable AI systems",
    industry: "Research & Products",
    location: "San Francisco, USA",
    website: "anthropic.com",
    expertCount: 8,
  },
]

export default function CompaniesPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </div>
  )
}

