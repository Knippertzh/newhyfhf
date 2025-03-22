import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewCompanyPage() {
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
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Company Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="AI Innovations Inc."
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-white">
                    Industry
                  </Label>
                  <Select>
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
                    placeholder="San Francisco, USA"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founded" className="text-white">
                    Founded Year
                  </Label>
                  <Input id="founded" placeholder="2020" className="bg-gray-900/70 border-gray-700 text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-white">
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Contact Email
                  </Label>
                  <Input
                    id="email"
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
                  placeholder="Enter a description of the company..."
                  className="min-h-[150px] bg-gray-900/70 border-gray-700 text-white"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                  Add Company
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

