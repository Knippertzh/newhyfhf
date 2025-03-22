import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Globe, Mail, Users, Building, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background"

// Mock data - replace with actual data fetching
const getCompanyById = (id: string) => {
  const companies = {
    "1": {
      id: "1",
      name: "DeepMind",
      description:
        "DeepMind is an AI research lab founded in 2010 and acquired by Google in 2014. The company focuses on developing artificial general intelligence (AGI) through a combination of machine learning and systems neuroscience. DeepMind has made significant breakthroughs in AI research, including the development of AlphaGo, AlphaFold, and other groundbreaking systems.",
      industry: "Research",
      location: "London, UK",
      founded: "2010",
      website: "deepmind.com",
      email: "info@deepmind.com",
      employees: "1000+",
      specializations: ["Reinforcement Learning", "Deep Learning", "Neuroscience", "Robotics"],
      keyAchievements: [
        "Developed AlphaGo, the first computer program to defeat a world champion in the game of Go",
        "Created AlphaFold, which solved the protein folding problem",
        "Pioneered various reinforcement learning techniques used across the industry",
      ],
      experts: [
        { id: "1", name: "Dr. Jane Smith", title: "AI Research Scientist", specialization: "Reinforcement Learning" },
      ],
    },
    "2": {
      id: "2",
      name: "OpenAI",
      description:
        "OpenAI is an AI research and deployment company founded in 2015. Its mission is to ensure that artificial general intelligence (AGI) benefits all of humanity. OpenAI conducts fundamental research in AI and develops commercial products based on its research, including GPT models, DALL-E, and other systems that have pushed the boundaries of what AI can do.",
      industry: "Research & Products",
      location: "San Francisco, USA",
      founded: "2015",
      website: "openai.com",
      email: "info@openai.com",
      employees: "500+",
      specializations: ["Natural Language Processing", "Generative AI", "Reinforcement Learning", "Multimodal AI"],
      keyAchievements: [
        "Developed GPT series of language models",
        "Created DALL-E for image generation from text",
        "Pioneered techniques for aligning AI systems with human values",
      ],
      experts: [
        {
          id: "2",
          name: "Prof. Alex Johnson",
          title: "Chief AI Officer",
          specialization: "Natural Language Processing",
        },
      ],
    },
    "3": {
      id: "3",
      name: "Google AI",
      description:
        "Google AI is Google's AI research division focused on advancing the state of the art in artificial intelligence and machine learning. The division works on fundamental research as well as applying AI to Google products and services. Google AI has made significant contributions to various fields of AI, including computer vision, natural language processing, and robotics.",
      industry: "Research & Products",
      location: "Mountain View, USA",
      founded: "2017",
      website: "ai.google",
      email: "ai-info@google.com",
      employees: "1000+",
      specializations: ["Computer Vision", "Natural Language Processing", "Machine Learning", "AI Ethics"],
      keyAchievements: [
        "Developed TensorFlow, one of the most widely used machine learning frameworks",
        "Created breakthrough computer vision systems used in Google Photos and other products",
        "Pioneered transformer architectures for natural language processing",
      ],
      experts: [{ id: "3", name: "Dr. Michael Chen", title: "ML Engineer", specialization: "Computer Vision" }],
    },
    "4": {
      id: "4",
      name: "Microsoft Research",
      description:
        "Microsoft Research is the research division of Microsoft dedicated to conducting both basic and applied research. Their AI research spans multiple areas including natural language processing, computer vision, and AI ethics. The division collaborates closely with academic institutions and contributes to Microsoft's AI-powered products.",
      industry: "Research & Products",
      location: "Redmond, USA",
      founded: "1991",
      website: "microsoft.com/research",
      email: "research@microsoft.com",
      employees: "1000+",
      specializations: ["AI Ethics", "Natural Language Processing", "Computer Vision", "Cloud AI"],
      keyAchievements: [
        "Developed key components of Microsoft Azure AI",
        "Created ethical AI frameworks adopted across the industry",
        "Pioneered advancements in conversational AI used in Microsoft products",
      ],
      experts: [{ id: "4", name: "Sarah Williams", title: "AI Ethics Researcher", specialization: "AI Ethics" }],
    },
    "5": {
      id: "5",
      name: "Meta AI",
      description:
        "Meta AI (formerly Facebook AI Research) is the artificial intelligence research division of Meta Platforms. The lab conducts research in areas including computer vision, NLP, and multimodal AI. Their mission is to advance the field of AI through open research for the benefit of all.",
      industry: "Research",
      location: "Menlo Park, USA",
      founded: "2013",
      website: "ai.meta.com",
      email: "ai@meta.com",
      employees: "800+",
      specializations: ["Multimodal Learning", "Computer Vision", "NLP", "AR/VR AI"],
      keyAchievements: [
        "Developed PyTorch, a leading deep learning framework",
        "Created advanced multimodal AI systems",
        "Pioneered AI techniques for augmented and virtual reality",
      ],
      experts: [
        { id: "5", name: "Dr. Raj Patel", title: "Senior Research Scientist", specialization: "Multimodal Learning" },
      ],
    },
    "6": {
      id: "6",
      name: "Anthropic",
      description:
        "Anthropic is an AI safety company working to build reliable, interpretable, and steerable AI systems. Founded by former members of OpenAI, Anthropic focuses on developing AI that is helpful, harmless, and honest. Their research emphasizes safety and alignment of advanced AI systems.",
      industry: "Research & Products",
      location: "San Francisco, USA",
      founded: "2021",
      website: "anthropic.com",
      email: "info@anthropic.com",
      employees: "150+",
      specializations: ["AI Safety", "Large Language Models", "AI Alignment", "Constitutional AI"],
      keyAchievements: [
        "Developed Claude, a conversational AI assistant",
        "Created Constitutional AI methodology",
        "Pioneered techniques for reducing harmful outputs from AI systems",
      ],
      experts: [],
    },
  }

  return companies[id as keyof typeof companies]
}

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = getCompanyById(params.id)

  // Use Clearbit Logo API to get real company logos
  const logoUrl = company?.website
    ? `https://logo.clearbit.com/${company.website.replace(/^https?:\/\//, "")}`
    : "/placeholder.svg?height=200&width=200"

  if (!company) {
    return (
      <div className="min-h-screen bg-black">
        <PageBackground intensity="low" />
        <Navbar />
        <div className="container py-10">
          <h1 className="text-3xl font-bold text-white">Company not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <PageBackground intensity="low" color="#00a3ff" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Company Info */}
          <div className="md:col-span-1">
            <Card className="bg-gray-900/70 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative h-40 w-40 rounded-lg overflow-hidden border-4 border-primary/20 bg-white p-4">
                    <Image
                      src={logoUrl || "/placeholder.svg"}
                      alt={company.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to placeholder if logo fetch fails
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=200&width=200`
                      }}
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">{company.name}</CardTitle>
                <CardDescription className="text-white">{company.industry}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-white">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>Founded in {company.founded}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{company.employees} employees</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Globe className="h-4 w-4 mr-2 text-primary" />
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                  <div className="flex items-center text-white">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    <a href={`mailto:${company.email}`} className="hover:underline">
                      {company.email}
                    </a>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2 text-white">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.specializations.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-white">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="md:col-span-2">
            <Card className="bg-gray-900/70 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">{company.description}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="achievements" className="mb-6">
              <TabsList className="bg-gray-900 border border-gray-700">
                <TabsTrigger
                  value="achievements"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Key Achievements
                </TabsTrigger>
                <TabsTrigger
                  value="experts"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  AI Experts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="mt-4">
                <Card className="bg-gray-900/70 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Key Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {company.keyAchievements.map((achievement, index) => (
                        <li key={index} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-start">
                            <div className="h-5 w-5 mr-2 text-primary mt-0.5 flex items-center justify-center rounded-full bg-primary/20">
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-white">{achievement}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experts" className="mt-4">
                <Card className="bg-gray-900/70 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">AI Experts at {company.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {company.experts.length > 0 ? (
                      <ul className="space-y-4">
                        {company.experts.map((expert) => (
                          <li key={expert.id} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-start">
                              <Building className="h-5 w-5 mr-2 text-primary mt-0.5" />
                              <div>
                                <Link href={`/experts/${expert.id}`}>
                                  <h4 className="font-medium text-white hover:text-primary">{expert.name}</h4>
                                </Link>
                                <p className="text-sm text-white">{expert.title}</p>
                                <Badge variant="outline" className="mt-1 text-white">
                                  {expert.specialization}
                                </Badge>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white">No experts found for this company.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

