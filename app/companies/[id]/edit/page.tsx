"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import PageBackground from "@/components/page-background"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { isValidUrl } from "@/lib/logo-utils"

// Define the Company type
type Company = {
  _id: string;
  name: string;
  description: string;
  industry: string;
  location?: string;
  founded?: string;
  foundedYear?: number;
  website?: string;
  email?: string;
  employees?: string;
  headquarters?: string;
  specializations?: string[];
  keyAchievements?: string[];
  experts?: Array<{
    id: string;
    name: string;
    title?: string;
    specialization?: string;
  }>;
};

// Function to fetch company by ID from MongoDB
const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const response = await fetch(`/api/companies/${id}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Error fetching company: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching company:', error)
    return null
  }
}

export default function EditCompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    foundedYear: "",
    website: "",
    email: "",
    description: "",
    employees: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: ""
  })
  
  // State for expert linking feature
  const [experts, setExperts] = useState<Array<{
    id: string;
    name: string;
    title?: string;
    specialization?: string;
  }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setFetchLoading(true);
        const data = await getCompanyById(id);
        if (!data) {
          setError("Company not found");
          return;
        }
        
        // Populate form data with company details
        setFormData({
          name: data.name || "",
          industry: data.industry || "",
          location: data.location || "",
          foundedYear: data.foundedYear ? data.foundedYear.toString() : "",
          website: data.website || "",
          email: data.email || "",
          description: data.description || "",
          employees: data.employees || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          facebook: data.facebook || "",
          instagram: data.instagram || ""
        });
        
        // Load existing expert associations
        if (data.experts && Array.isArray(data.experts)) {
          setExperts(data.experts);
        }
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company details");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

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

  // Function to search for experts by name
  const searchExperts = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      // Fetch experts from API with name parameter (matching the experts page implementation)
      const params = new URLSearchParams();
      params.append("name", query);
      
      const response = await fetch(`/api/experts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search experts');
      }
      
      const data = await response.json();
      
      // Filter out experts that are already linked
      const filteredResults = data.filter((expert: any) => 
        !experts.some(linkedExpert => linkedExpert.id === expert.id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching experts:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for experts",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle expert search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      searchExperts(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Add expert to company
  const addExpert = (expert: any) => {
    const expertToAdd = {
      id: expert.id,
      name: expert.name || "Unknown Expert",
      title: expert.title || "",
      specialization: expert.specialization || ""
    };
    
    setExperts(prev => [...prev, expertToAdd]);
    setSearchResults([]);
    setSearchTerm("");
    
    toast({
      title: "Expert Added",
      description: `${expertToAdd.name} has been linked to this company`,
      variant: "default",
    });
  };
  
  // Remove expert from company
  const removeExpert = (expertId: string) => {
    setExperts(prev => prev.filter(expert => expert.id !== expertId));
    
    toast({
      title: "Expert Removed",
      description: "Expert has been unlinked from this company",
      variant: "default",
    });
  };

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

      // Convert foundedYear to number if provided and include experts
      const companyData = {
        ...formData,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
        logoVerified,
        experts: experts
      }

      // Submit to API
      const response = await fetch(`/api/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update company')
      }

      // Show success notification
      toast({
        title: "Update Successful",
        description: "Company was successfully updated in the database",
        variant: "default",
      })

      // Redirect to company detail page
      router.push(`/companies/${id}`)
      router.refresh()
    } catch (err) {
      console.error('Error updating company:', err)
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

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-black">
        <PageBackground intensity="low" color="#00a3ff" />
        <Navbar />
        <div className="container py-10 text-center">
          <h1 className="text-3xl font-bold text-white">
            Loading company details...
          </h1>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-black">
        <PageBackground intensity="low" color="#00a3ff" />
        <Navbar />
        <div className="container py-10 text-center">
          <h1 className="text-3xl font-bold text-white">
            {error || "Company not found"}
          </h1>
          <Button asChild className="mt-4">
            <Link href="/companies">Back to Companies</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <PageBackground intensity="low" color="#00a3ff" />
      <Navbar />
      <div className="container py-10">
        <div className="mb-6">
          <Button asChild variant="dark-solid" size="sm">
            <Link href={`/companies/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Company Details
            </Link>
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Edit Company</CardTitle>
            <CardDescription className="text-white">
              Update the company information below
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
                
                <div className="space-y-2">
                  <Label htmlFor="employees" className="text-white">
                    Employees
                  </Label>
                  <Input
                    id="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    placeholder="100-500"
                    className="bg-gray-900/70 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <h3 className="text-lg font-medium text-white mb-2">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-white">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="linkedin.com/company/name or just company-name"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="bg-gray-900/70 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-white">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="twitter.com/handle or just handle"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="bg-gray-900/70 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-white">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="facebook.com/pagename or just pagename"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="bg-gray-900/70 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-white">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="instagram.com/handle or just handle"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="bg-gray-900/70 border-gray-700 text-white"
                    />
                  </div>
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
              
              {/* Expert Linking Section */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium text-white">Linked AI Experts</h3>
                
                {/* Expert Search */}
                <div className="space-y-2">
                  <Label htmlFor="expertSearch" className="text-white">
                    Search for AI Experts
                  </Label>
                  <div className="relative">
                    <Input
                      id="expertSearch"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Type expert name to search..."
                      className="bg-gray-900/70 border-gray-700 text-white"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-opacity-50 border-t-white rounded-full"></div>
                      </div>
                    )}
                    
                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                        {searchResults.map((expert) => (
                          <div 
                            key={expert._id} 
                            className="p-2 hover:bg-gray-800 cursor-pointer text-white"
                            onClick={() => addExpert(expert)}
                          >
                            <div className="font-medium">{expert.personalInfo?.fullName || expert.name || "Unknown Expert"}</div>
                            <div className="text-xs text-gray-400">{expert.personalInfo?.title || expert.title || ""}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Selected Experts List */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white mb-2">Linked Experts</h4>
                  {experts.length === 0 ? (
                    <p className="text-sm text-gray-400">No experts linked to this company yet</p>
                  ) : (
                    <div className="space-y-2">
                      {experts.map((expert) => (
                        <div key={expert.id} className="flex items-center justify-between bg-gray-800/50 p-2 rounded-md">
                          <div>
                            <div className="text-white">{expert.name}</div>
                            <div className="text-xs text-gray-400">{expert.title || ""}</div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeExpert(expert.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Company'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}