import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewExpertPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container py-10">
        <div className="mb-6">
          <Button asChild variant="dark-solid" size="sm">
            <Link href="/experts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Experts
            </Link>
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Expert</CardTitle>
            <CardDescription className="text-white">
              Fill out the form below to add a new AI expert to the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <Input id="name" placeholder="Dr. Jane Smith" className="bg-gray-900/70 border-gray-700 text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Title/Position
                  </Label>
                  <Input
                    id="title"
                    placeholder="AI Research Scientist"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane.smith@example.com"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">
                    Company/Organization
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-900/70 border-gray-700 text-white">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="deepmind">DeepMind</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="google">Google AI</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-white">
                    Primary Specialization
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-900/70 border-gray-700 text-white">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="ml">Machine Learning</SelectItem>
                      <SelectItem value="nlp">Natural Language Processing</SelectItem>
                      <SelectItem value="cv">Computer Vision</SelectItem>
                      <SelectItem value="rl">Reinforcement Learning</SelectItem>
                      <SelectItem value="robotics">Robotics</SelectItem>
                      <SelectItem value="ethics">AI Ethics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-white">
                    Personal Website (optional)
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Biography
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Enter a brief biography of the expert..."
                  className="min-h-[150px] bg-gray-900/70 border-gray-700 text-white"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                  Add Expert
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

