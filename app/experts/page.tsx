import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ExpertCard } from "@/components/expert-card"
import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background"

// Enhanced mock data with more realistic information
const mockExperts = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    title: "AI Research Scientist",
    company: "DeepMind",
    specialization: "Reinforcement Learning",
    email: "jane.smith@deepmind.com",
  },
  {
    id: "2",
    name: "Prof. Alex Johnson",
    title: "Chief AI Officer",
    company: "OpenAI",
    specialization: "Natural Language Processing",
    email: "alex.johnson@openai.com",
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    title: "ML Engineer",
    company: "Google AI",
    specialization: "Computer Vision",
    email: "michael.chen@google.com",
  },
  {
    id: "4",
    name: "Sarah Williams",
    title: "AI Ethics Researcher",
    company: "Microsoft Research",
    specialization: "AI Ethics",
    email: "sarah.williams@microsoft.com",
  },
  {
    id: "5",
    name: "Dr. Raj Patel",
    title: "Senior Research Scientist",
    company: "Meta AI",
    specialization: "Multimodal Learning",
    email: "raj.patel@meta.com",
  },
  {
    id: "6",
    name: "Emma Rodriguez",
    title: "Robotics Engineer",
    company: "Boston Dynamics",
    specialization: "Robotics",
    email: "emma.rodriguez@bostondynamics.com",
  },
]

export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-black">
      <PageBackground intensity="low" color="#4c00b0" />
      <Navbar />
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">AI Experts</h1>
          <Button asChild className="bg-purple-600 text-white hover:bg-purple-700">
            <Link href="/experts/new">Add Expert</Link>
          </Button>
        </div>

        <Card className="mb-8 bg-gray-900/70 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Search Experts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by name or specialization"
                className="bg-gray-900/70 border-gray-700 text-white"
              />
              <Input placeholder="Filter by company" className="bg-gray-900/70 border-gray-700 text-white" />
              <Button className="bg-purple-600 text-white hover:bg-purple-700">Search</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </div>
  )
}

