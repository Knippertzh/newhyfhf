"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mail, Globe, Linkedin, Twitter, Building, Award, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background"
import AIEnrichmentButton from "@/components/AIEnrichmentButton"

// Define the Expert interface to match the MongoDB schema
interface Education {
  degreeName?: string;
  fieldOfStudy?: string;
  schoolName?: string;
  timePeriod?: {
    startDate?: { year?: number };
    endDate?: { year?: number };
  };
  degree?: string;
  institution?: string;
  year?: string;
}

interface Publication {
  title: string;
  venue: string;
  year: string;
}

interface Project {
  name: string;
  description: string;
}

interface PersonalInfo {
  fullName?: string;
  title?: string;
  dateOfBirth?: string;
  nationality?: string;
  email?: string;
  location?: string;
  languages?: string[];
  image?: string;
  phone?: string | null;
  allData?: any;
}

interface Institution {
  name?: string;
  position?: string;
  department?: string | null;
  website?: string | null;
}

interface Expertise {
  primary?: string[];
  secondary?: string[];
  industries?: string[];
}

interface Expert {
  _id?: string;
  id?: string;
  userId?: string;
  personalInfo?: PersonalInfo;
  institution?: Institution;
  expertise?: Expertise;
  name?: string;
  title?: string;
  company?: string;
  companyId?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  bio?: string;
  specializations?: string[];
  education?: Education[];
  publications?: Publication[];
  projects?: Project[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
}

export default function ExpertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
const [id, setId] = useState<string | null>(null);

useEffect(() => {
  params.then(resolvedParams => {
    setId(resolvedParams.id);
  });
}, [params]);
useEffect(() => {
  // Perform any asynchronous operations here
  // For example, fetching expert details using the id
}, [id]);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        // Using server-side API for client components
        const response = await fetch(`/api/experts/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Expert not found');
          } else {
            setError('Failed to fetch expert data');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setExpert(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expert:', err);
        setError('An error occurred while fetching expert data');
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  // Generate avatar URL based on name or use image from personalInfo
  const avatarUrl = expert?.personalInfo?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert?.personalInfo?.fullName || expert?.name || "Unknown")}&background=random&size=300&bold=true&color=fff`;
  
  // Extract bio from personalInfo.allData if available
  const bio = expert?.bio || expert?.personalInfo?.allData?.bio || "";

  if (!expert) {
    return (
      <div className="min-h-screen bg-black">
        <PageBackground intensity="low" />
        <Navbar />
        <div className="container py-10">
          <h1 className="text-3xl font-bold text-white">Expert not found</h1>
        </div>
      </div>
    )
  }

  const categories = {
    "Overview": ["name", "title", "company", "bio", "personalInfo", "institution"],
    "Specializations": ["specializations", "expertise"],
    "Education": ["education"],
    "Publications": ["publications", "academicMetrics"],
    "Projects": ["projects"],
    "Contact Information": ["email", "website", "linkedin", "twitter", "profiles", "personalInfo.phone", "personalInfo.email", "personalInfo.address", "personalInfo.location"],
    "Additional Information": ["priorCompany", "comments", "references", "personalInfo.languages", "personalInfo.nationality", "tags"],
  };

  type CategoryKey = keyof typeof categories;

  return (
    <div className="min-h-screen bg-black">
      <PageBackground intensity="low" color="#4c00b0" />
      <Navbar />
      <div className="container py-10">
        <div className="mb-6 flex gap-2">
          <Button asChild variant="dark-solid" size="sm">
            <Link href="/experts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Experts
            </Link>
          </Button>
<Button asChild variant="dark-solid" size="sm">
<Link href={`/experts/${id}/edit`}>
              <BookOpen className="h-4 w-4 mr-2" />
              Edit Expert
            </Link>
          </Button>
          <AIEnrichmentButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-1">
            <Card className="bg-gray-900/70 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-primary/20">
<Image src={avatarUrl || "/placeholder.svg"} alt={expert?.name || "Unknown"} fill className="object-cover" loading="lazy" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">{expert?.personalInfo?.fullName || expert?.name || "Unknown"}</CardTitle>
                <CardDescription className="text-white">{expert?.personalInfo?.title || expert?.title || ""}</CardDescription>
              </CardHeader>
              <CardContent>
                {(expert?.institution?.name || expert?.company) && (
                  <div className="flex items-center justify-center gap-2 text-white mb-3">
                    <Building className="h-4 w-4 text-purple-400" />
                    <span>{expert?.institution?.name || expert?.company}</span>
                    {expert?.institution?.position && (
                      <span className="text-sm text-gray-300">({expert.institution.position})</span>
                    )}
                  </div>
                )}
                
                {expert?.specializations && expert.specializations.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {expert.specializations.slice(0, 3).map((spec, index) => (
                      <Badge key={index} className="bg-purple-600/20 text-purple-300">
                        {spec}
                      </Badge>
                    ))}
                    {expert.specializations.length > 3 && (
                      <Badge className="bg-gray-700/50 text-gray-300">+{expert.specializations.length - 3}</Badge>
                    )}
                  </div>
                )}
                
                <div className="flex justify-center gap-3 mt-6">
                  {expert?.email && (
                    <a href={`mailto:${expert.email}`} title="Email" className="text-gray-300 hover:text-purple-400 transition-colors">
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                  {expert?.website && (
                    <a href={expert.website.startsWith('http') ? expert.website : `https://${expert.website}`} target="_blank" rel="noopener noreferrer" title="Website" className="text-gray-300 hover:text-purple-400 transition-colors">
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                  {expert?.linkedin && (
                    <a href={expert.linkedin.startsWith('http') ? expert.linkedin : `https://linkedin.com/in/${expert.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-gray-300 hover:text-purple-400 transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {expert?.twitter && (
                    <a href={expert.twitter.startsWith('http') ? expert.twitter : `https://twitter.com/${expert.twitter}`} target="_blank" rel="noopener noreferrer" title="Twitter" className="text-gray-300 hover:text-purple-400 transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

{/* Right Column - Detailed Info */}
<div className="md:col-span-2">
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="bg-gray-900 border border-gray-700">
                {Object.keys(categories).map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category.toLowerCase().replace(/ /g, "")}
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.keys(categories).map((category) => (
                <TabsContent key={category} value={category.toLowerCase().replace(/ /g, "")} className="mt-4">
                  <Card className="bg-gray-900/70 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categories[category as CategoryKey].map((key: string) => {
                          // Handle nested keys like personalInfo.email
                          let value;
                          if (key.includes('.')) {
                            const [parentKey, childKey] = key.split('.');
                            value = expert && (expert as any)[parentKey] ? (expert as any)[parentKey][childKey] : undefined;
                          } else {
                            value = (expert as any)[key];
                          }
                          
                          // Handle different data types appropriately
                          if (key === "specializations" && Array.isArray(value)) {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Specializations</h3>
                                <div className="flex flex-wrap gap-2">
                                  {value.map((spec, index) => (
                                    <Badge key={index} className="bg-purple-600/20 text-purple-300 hover:bg-purple-600/30">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            );
                          } else if (key === "expertise" && value && typeof value === 'object') {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Expertise</h3>
                                {value.primary && value.primary.length > 0 && (
                                  <div className="mb-3">
                                    <h4 className="font-semibold mb-1">Primary Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {value.primary.map((item: string, index: number) => (
                                        <Badge key={index} className="bg-purple-600/20 text-purple-300 hover:bg-purple-600/30">
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {value.secondary && value.secondary.length > 0 && (
                                  <div className="mb-3">
                                    <h4 className="font-semibold mb-1">Secondary Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {value.secondary.map((item: string, index: number) => (
                                        <Badge key={index} className="bg-gray-700/50 text-gray-300">
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {value.industries && value.industries.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-1">Industries</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {value.industries.map((item: string, index: number) => (
                                        <Badge key={index} className="bg-blue-600/20 text-blue-300">
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          } else if (key === "education" && Array.isArray(value)) {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Education</h3>
                                <div className="space-y-3">
                                  {value.map((edu, index) => (
                                    <Card key={index} className="bg-gray-800/50 border-gray-700">
                                      <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h4 className="font-bold">{edu.degree || edu.degreeName}</h4>
                                            <p className="text-sm text-gray-300">{edu.institution || edu.schoolName}</p>
                                            {edu.fieldOfStudy && (
                                              <p className="text-xs text-gray-400 mt-1">{edu.fieldOfStudy}</p>
                                            )}
                                          </div>
                                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                                            {edu.year || (edu.timePeriod ? `${edu.timePeriod.startDate?.year || ''}-${edu.timePeriod.endDate?.year || 'Present'}` : '')}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            );
                          } else if (key === "publications" && Array.isArray(value)) {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Publications</h3>
                                <div className="space-y-3">
                                  {value.map((pub, index) => (
                                    <Card key={index} className="bg-gray-800/50 border-gray-700">
                                      <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h4 className="font-bold">{pub.title}</h4>
                                            <p className="text-sm text-gray-300">{pub.venue}</p>
                                          </div>
                                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                                            {pub.year}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            );
                          } else if (key === "academicMetrics" && value && typeof value === 'object') {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Academic Metrics</h3>
                                {value.publications && (
                                  <div className="mb-3">
                                    {value.publications.total && (
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold">Total Publications:</span>
                                        <span>{value.publications.total}</span>
                                      </div>
                                    )}
                                    {value.publications.sources && (
                                      <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Profiles:</h4>
                                        {value.publications.sources.googleScholar && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm">Google Scholar:</span>
                                            <a href={value.publications.sources.googleScholar} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline text-sm">
                                              {value.publications.sources.googleScholar}
                                            </a>
                                          </div>
                                        )}
                                        {value.publications.sources.scopus && (
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm">Scopus:</span>
                                            <a href={value.publications.sources.scopus} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline text-sm">
                                              {value.publications.sources.scopus}
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          } else if (key === "projects" && Array.isArray(value)) {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Projects</h3>
                                <div className="space-y-3">
                                  {value.map((project, index) => (
                                    <Card key={index} className="bg-gray-800/50 border-gray-700">
                                      <CardContent className="p-4">
                                        <h4 className="font-bold">{project.name}</h4>
                                        <p className="text-sm text-gray-300 mt-1">{project.description}</p>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            );
                          } else if (key === "bio") {
                            // Use the bio variable that combines data from different sources
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Bio</h3>
                                <p className="text-gray-300">{bio}</p>
                              </div>
                            );
                          } else if (key === "personalInfo" && value && typeof value === 'object') {
                            // Display personal info that isn't already shown elsewhere
                            const fieldsToShow = [];
                            
                            if (value.languages && Array.isArray(value.languages) && value.languages.length > 0) {
                              fieldsToShow.push(
                                <div key="languages" className="mb-2">
                                  <span className="font-semibold">Languages:</span>{' '}
                                  {value.languages.join(', ')}
                                </div>
                              );
                            }
                            
                            if (value.nationality) {
                              fieldsToShow.push(
                                <div key="nationality" className="mb-2">
                                  <span className="font-semibold">Nationality:</span>{' '}
                                  {value.nationality}
                                </div>
                              );
                            }
                            
                            if (value.dateOfBirth) {
                              fieldsToShow.push(
                                <div key="dateOfBirth" className="mb-2">
                                  <span className="font-semibold">Date of Birth:</span>{' '}
                                  {value.dateOfBirth}
                                </div>
                              );
                            }
                            
                            return fieldsToShow.length > 0 ? (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Personal Information</h3>
                                {fieldsToShow}
                              </div>
                            ) : null;
                          } else if (key === "institution" && value && typeof value === 'object') {
                            // Display institution info that isn't already shown elsewhere
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Institution</h3>
                                {value.name && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <Building className="h-4 w-4 text-purple-400" />
                                    <span className="font-semibold">Organization:</span>
                                    <span>{value.name}</span>
                                  </div>
                                )}
                                {value.position && (
                                  <div className="mb-2">
                                    <span className="font-semibold">Position:</span>{' '}
                                    {value.position}
                                  </div>
                                )}
                                {value.department && (
                                  <div className="mb-2">
                                    <span className="font-semibold">Department:</span>{' '}
                                    {value.department}
                                  </div>
                                )}
                                {value.website && (
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-purple-400" />
                                    <span className="font-semibold">Website:</span>
                                    <a href={value.website.startsWith('http') ? value.website : `https://${value.website}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                                      {value.website}
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          } else if (key === "profiles" && value && typeof value === 'object') {
                            // Display social profiles and links
                            const profileLinks = [];
                            
                            if (value.linkedin) {
                              profileLinks.push(
                                <div key="linkedin" className="flex items-center gap-2 mb-2">
                                  <Linkedin className="h-4 w-4 text-purple-400" />
                                  <span className="font-semibold">LinkedIn:</span>
                                  <a href={value.linkedin.startsWith('http') ? value.linkedin : `https://linkedin.com/in/${value.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                                    {value.linkedin}
                                  </a>
                                </div>
                              );
                            }
                            
                            if (value.twitter) {
                              profileLinks.push(
                                <div key="twitter" className="flex items-center gap-2 mb-2">
                                  <Twitter className="h-4 w-4 text-purple-400" />
                                  <span className="font-semibold">Twitter:</span>
                                  <a href={value.twitter.startsWith('http') ? value.twitter : `https://twitter.com/${value.twitter}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                                    {value.twitter}
                                  </a>
                                </div>
                              );
                            }
                            
                            if (value.company) {
                              profileLinks.push(
                                <div key="company" className="flex items-center gap-2 mb-2">
                                  <Globe className="h-4 w-4 text-purple-400" />
                                  <span className="font-semibold">Company Website:</span>
                                  <a href={value.company.startsWith('http') ? value.company : `https://${value.company}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                                    {value.company}
                                  </a>
                                </div>
                              );
                            }
                            
                            if (value.other) {
                              profileLinks.push(
                                <div key="other" className="flex items-center gap-2 mb-2">
                                  <Globe className="h-4 w-4 text-purple-400" />
                                  <span className="font-semibold">Other Links:</span>
                                  <a href={value.other.startsWith('http') ? value.other : `https://${value.other}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                                    {value.other}
                                  </a>
                                </div>
                              );
                            }
                            
                            return profileLinks.length > 0 ? (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Online Profiles</h3>
                                {profileLinks}
                              </div>
                            ) : null;
                          } else if (key === "references" && Array.isArray(value) && value.length > 0) {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">References</h3>
                                <div className="space-y-2">
                                  {value.map((ref, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <span>•</span>
                                      <div>
                                        <span>{ref.name}</span>
                                        {ref.link && (
                                          <a href={ref.link} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline ml-2">
                                            [Link]
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          } else if (key === "tags" && Array.isArray(value) && value.length > 0) {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                  {value.map((tag, index) => (
                                    <Badge key={index} className="bg-gray-700/50 text-gray-300">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            );
                          } else if (key === "priorCompany" && value) {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Prior Company</h3>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-purple-400" />
                                  <span>{value}</span>
                                </div>
                              </div>
                            );
                          } else if (key === "comments" && value) {
                            return (
                              <div key={key} className="text-white">
                                <h3 className="font-bold text-lg mb-2">Additional Comments</h3>
                                <p className="text-gray-300">{value}</p>
                              </div>
                            );
                          } else if (key === "email" && typeof value === "string") {
                            return (
                              <div key={key} className="text-white flex items-center gap-2">
                                <Mail className="h-4 w-4 text-purple-400" />
                                <span className="font-bold">Email:</span>
                                <a href={`mailto:${value}`} className="text-purple-300 hover:underline">{value}</a>
                              </div>
                            );
                          } else if (key === "personalInfo.email" && typeof value === "string") {
                            return (
                              <div key={key} className="text-white flex items-center gap-2">
                                <Mail className="h-4 w-4 text-purple-400" />
                                <span className="font-bold">Email:</span>
                                <a href={`mailto:${value}`} className="text-purple-300 hover:underline">{value}</a>
                              </div>
                            );
                          } else if (key === "personalInfo.phone" && value) {
                            return (
                              <div key={key} className="text-white flex items-center gap-2">
                                <span className="font-bold">Phone:</span>
                                <a href={`tel:${value}`} className="text-purple-300 hover:underline">{value}</a>
                              </div>
                            );
                          } else if (key === "personalInfo.address" && value) {
                            return (
                              <div key={key} className="text-white flex items-center gap-2">
                                <span className="font-bold">Address:</span>
                                <span>{value}</span>
                              </div>
                            );
                          } else if (key === "personalInfo.location" && value) {
                            return (
                              <div key={key} className="text-white flex items-center gap-2">
                                <span className="font-bold">Location:</span>
                                <span>{value}</span>
                              </div>
                            );
                          } else if (key === "website" && typeof value === "string") {
                            return (
                              <div key={key} className="text-white flex items-center gap-2">
                                <Globe className="h-4 w-4 text-purple-400" />
                                <span className="font-bold">Website:</span>
                                <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                                  {value}
                                </a>
                              </div>
                            );
                          } else if (key === "linkedin" && typeof value === "string") {
                            return (
                              <div key={key} className="text-white flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-purple-400" />
                                <span className="font-bold">LinkedIn:</span>
                                <a href={value.startsWith('http') ? value : `https://linkedin.com/in/${value}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                                  {value}
                                </a>
                              </div>
                            );
                          } else if (key === "twitter" && typeof value === "string") {
                            return (
                              <div key={key} className="text-white flex items-center gap-2">
                                <Twitter className="h-4 w-4 text-purple-400" />
                                <span className="font-bold">Twitter:</span>
                                <a href={value.startsWith('http') ? value : `https://twitter.com/${value}`} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                                  {value}
                                </a>
                              </div>
                            );
                          } else if (key === "company") {
                            const companyName = expert?.institution?.name || expert?.company || "";
                            return companyName ? (
                              <div key={key} className="text-white flex items-center gap-2">
                                <Building className="h-4 w-4 text-purple-400" />
                                <span className="font-bold">Company:</span>
                                <span>{companyName}</span>
                              </div>
                            ) : null;
                          } else if (key === "name" || key === "title") {
                            // Skip these as they're already shown in the profile card
                            return null;
                          } else if (key === "personalInfo.languages" && Array.isArray(value)) {
                            return (
                              <div key={key} className="text-white">
                                <span className="font-bold">Languages:</span>{' '}
                                {value.join(', ')}
                              </div>
                            );
                          } else if (key === "personalInfo.nationality" && value) {
                            return (
                              <div key={key} className="text-white">
                                <span className="font-bold">Nationality:</span>{' '}
                                {value}
                              </div>
                            );
                          } else {
                            // Default rendering for other fields
                            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                              // Skip rendering complex objects directly
                              return null;
                            }
                            
                            // Format the key for display
                            const displayKey = key.includes('.') 
                              ? key.split('.')[1].charAt(0).toUpperCase() + key.split('.')[1].slice(1)
                              : key.charAt(0).toUpperCase() + key.slice(1);
                            
                            return (
                              <div key={key} className="text-white">
                                <span className="font-bold">{displayKey}:</span>{' '}
                                {Array.isArray(value) ? value.join(', ') : value}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
