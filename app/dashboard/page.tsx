"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { DashboardChart } from "@/components/dashboard-chart.tsx"
import { DashboardStats } from "@/components/dashboard-stats.tsx"
import Navbar from "@/components/navbar.tsx"
import PageBackground from "@/components/page-background.tsx"
import { NewsCard3D } from "@/components/news-card-3d.tsx"
import { useState, useEffect } from "react";
import Notepad from "../../components/Notepad";
import ShareButton from "@/components/share-button";

interface Article {
  title: string;
  description: string;
  url: string;
  image?: string;
}

interface Expert {
  personalInfo: {
    fullName: string;
    image: string;
    title: string;
    email?: string;
    bio?: string;
  };
  specializations?: string[];
  expertise?: {
    primary?: string[];
    secondary?: string[];
  };
  institution?: {
    name?: string;
    position?: string;
    department?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
  publications?: Array<{
    title: string;
    year?: number;
    url?: string;
  }>;
}

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  logoUrl?: string;
  website?: string;
  expertCount: number;
}

export default function DashboardPage() {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(
          "https://gnews.io/api/v4/top-headlines?category=ai&lang=en&country=us&max=5&q=AI&apikey=e050e098c2b318a7625b9bec0a069914"
        );
        const data = await response.json();
        if (data.articles) {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    async function fetchRandomExpert() {
      try {
        const response = await fetch('/api/experts/random');
        const data = await response.json();
        
        // Even if response is not OK, we should still try to use the data
        // as our API now returns fallback data instead of error status codes
        if (data && data.personalInfo) {
          setExpert(data);
        } else {
          console.error("Invalid expert data structure:", data);
          // Set fallback expert data
          setExpert({
            personalInfo: {
              fullName: 'Example Expert',
              title: 'AI Specialist',
              image: '/placeholder-user.jpg'
            },
            institution: {
              name: 'Example Institution',
              position: 'Researcher'
            },
            expertise: {
              primary: ['Artificial Intelligence'],
              secondary: ['Data Science']
            },
            specializations: ['AI Ethics']
          });
        }
      } catch (error) {
        console.error("Error fetching random expert:", error);
        // Set fallback expert data
        setExpert({
          personalInfo: {
            fullName: 'Example Expert',
            title: 'AI Specialist',
            image: '/placeholder-user.jpg'
          },
          institution: {
            name: 'Example Institution',
            position: 'Researcher'
          },
          expertise: {
            primary: ['Artificial Intelligence'],
            secondary: ['Data Science']
          },
          specializations: ['AI Ethics']
        });
      }
    };

    fetchRandomExpert();
  }, []);

  useEffect(() => {
    async function fetchRandomCompany() {
      try {
        const response = await fetch('/api/companies/random');
        const data = await response.json();
        
        // Even if response is not OK, we should still try to use the data
        // as our API now returns fallback data instead of error status codes
        if (data && data.name) {
          setCompany(data);
        } else {
          console.error("Invalid company data structure:", data);
          // Set fallback company data
          setCompany({
            id: 'fallback-company-id',
            name: 'Example AI Company',
            description: 'A leading AI research and development company.',
            industry: 'Artificial Intelligence',
            location: 'Berlin, Germany',
            logoUrl: '/placeholder-logo.svg',
            website: 'https://example.com',
            expertCount: 5
          });
        }
      } catch (error) {
        console.error("Error fetching random company:", error);
        // Set fallback company data
        setCompany({
          id: 'fallback-company-id',
          name: 'Example AI Company',
          description: 'A leading AI research and development company.',
          industry: 'Artificial Intelligence',
          location: 'Berlin, Germany',
          logoUrl: '/placeholder-logo.svg',
          website: 'https://example.com',
          expertCount: 5
        });
      }
    };

    fetchRandomCompany();
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />
      <div className="absolute inset-0 z-0">
        <PageBackground intensity="high" />
      </div>
      <div className="container relative py-10">
        <Notepad />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <ShareButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900/70 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">MongoDB Expert Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {expert && expert.personalInfo && (
                <div className="flex items-center space-x-4">
                  <img src={expert.personalInfo.image} alt={expert.personalInfo.fullName} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h2 className="text-white text-lg">{expert.personalInfo.fullName}</h2>
                    <p className="text-gray-400">{expert.personalInfo.title}</p>
                    {expert.institution?.name && <p className="text-gray-400 text-sm">{expert.institution.name}</p>}
                    {expert.specializations && expert.specializations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-400 text-xs">Specializations:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {expert.specializations.slice(0, 2).map((spec, index) => (
                            <span key={index} className="text-xs bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded">
                              {spec}
                            </span>
                          ))}
                          {expert.specializations.length > 2 && (
                            <span className="text-xs text-purple-400">+{expert.specializations.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    <button className="mt-2 text-purple-600 hover:underline">More</button>
                  </div>
                </div>
              )}
              {!expert && (
                <div className="text-center py-4">
                  <p className="text-gray-400">Loading expert data...</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gray-900/70 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Random Company Example</CardTitle>
            </CardHeader>
            <CardContent>
              {company && (
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 relative bg-white rounded-md p-2 flex items-center justify-center">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="max-h-full max-w-full" />
                    ) : (
                      <span className="text-gray-400 text-xs text-center">{company.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-white text-lg">{company.name}</h2>
                    <p className="text-gray-400">{company.industry}</p>
                    <p className="text-gray-400 text-sm">{company.location}</p>
                    <button className="mt-2 text-purple-600 hover:underline">More</button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gray-900/70 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">AI News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {articles.map((article) => (
                  <NewsCard3D key={article.url} article={article} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DashboardStats />

        <Tabs defaultValue="experts" className="mt-8">
          <TabsList className="bg-gray-900 border border-gray-700">
            <TabsTrigger
              value="experts"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Experts
            </TabsTrigger>
            <TabsTrigger
              value="companies"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Companies
            </TabsTrigger>
            <TabsTrigger
              value="specializations"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Specializations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="experts" className="mt-4">
            <Card className="bg-gray-900/70 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Experts by Specialization
                </CardTitle>
                <CardDescription className="text-white">
                  Distribution of AI experts across different specialization areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart type="experts" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="companies" className="mt-4">
            <Card className="bg-gray-900/70 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Companies by Industry</CardTitle>
                <CardDescription className="text-white">
                  Distribution of AI companies across different industries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart type="companies" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specializations" className="mt-4">
            <Card className="bg-gray-900/70 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Popular Specializations</CardTitle>
                <CardDescription className="text-white">
                  Most common AI specializations in the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart type="specializations" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
