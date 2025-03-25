"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Globe, Mail, Users, Building, Calendar, Linkedin, Twitter, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background";
import AIEnrichmentButton from "@/components/AIEnrichmentButton";
import { generateLogoUrl, getPlaceholderLogo } from "@/lib/logo-utils";

import { useEffect, useState, use } from "react";

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
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  experts?: Array<{
    id: string;
    name: string;
    title: string;
    specialization: string;
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

export default function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = use(params).id;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await getCompanyById(id);
        setCompany(data);
        if (!data) {
          setError("Company not found");
        }
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  // Generate logo URL using our utility function
  const logoUrl = company ? generateLogoUrl(company.website, company.name) : getPlaceholderLogo();

  if (loading) {
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

  if (error || !company) {
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
        <div className="mb-6 flex justify-between">
          <Button asChild variant="dark-solid" size="sm">
            <Link href="/companies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/companies/${id}/edit`}>
              Edit Company
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
                      src={logoUrl}
                      alt={company.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to placeholder if logo fetch fails
                        const target = e.target as HTMLImageElement;
                        target.src = getPlaceholderLogo(200, 200);
                      }}
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  {company.name}
                </CardTitle>
                <CardDescription className="text-white">
                  {company.industry}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-white">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>Founded in {company.foundedYear || company.founded}</span>
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
                  
                  {/* Social Media Links */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-medium mb-3 text-white">Social Media</h3>
                    <div className="flex justify-center gap-3">
                      {company.linkedin && (
                        <a 
                          href={company.linkedin.startsWith('http') ? company.linkedin : `https://linkedin.com/company/${company.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title="LinkedIn" 
                          className="text-gray-300 hover:text-primary transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {company.twitter && (
                        <a 
                          href={company.twitter.startsWith('http') ? company.twitter : `https://twitter.com/${company.twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title="Twitter" 
                          className="text-gray-300 hover:text-primary transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {company.facebook && (
                        <a 
                          href={company.facebook.startsWith('http') ? company.facebook : `https://facebook.com/${company.facebook}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title="Facebook" 
                          className="text-gray-300 hover:text-primary transition-colors"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {company.instagram && (
                        <a 
                          href={company.instagram.startsWith('http') ? company.instagram : `https://instagram.com/${company.instagram}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          title="Instagram" 
                          className="text-gray-300 hover:text-primary transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2 text-white">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {company.specializations?.map((spec) => (
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
  <AIEnrichmentButton />
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
                      {company.keyAchievements?.map((achievement, index) => (
                        <li
                          key={index}
                          className="border-b border-gray-800 pb-3 last:border-0 last:pb-0"
                        >
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
                    <CardTitle className="text-white">
                      AI Experts at {company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {company.experts && company.experts.length > 0 ? (
                      <ul className="space-y-4">
                        {company.experts?.map((expert) => (
                          <li
                            key={expert.id}
                            className="border-b border-gray-800 pb-3 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start">
                              <Building className="h-5 w-5 mr-2 text-primary mt-0.5" />
                              <div>
                                <Link href={`/experts/${expert.id}`}>
                                  <h4 className="font-medium text-white hover:text-primary">
                                    {expert.name}
                                  </h4>
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
  );
}
