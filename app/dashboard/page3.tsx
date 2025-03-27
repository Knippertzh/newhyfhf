\"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardChart } from "@/components/dashboard-chart"
import { DashboardStats } from "@/components/dashboard-stats"
import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background"
import { useState, useEffect } from "react";

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

export default function DashboardPage() {
  const [expert, setExpert] = useState<Expert | null>(null);

  useEffect(() => {
    async function fetchRandomExpert() {
      try {
        const response = await fetch('/api/experts/random');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.personalInfo?.fullName && data.personalInfo?.image && data.personalInfo?.title) {
          setExpert(data);
        } else {
          console.error("Invalid expert data structure:", data);
          setExpert(null);
        }
      } catch (error) {
        console.error("Error fetching random expert:", error);
        setExpert(null);
      }
    };

    fetchRandomExpert();
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />
      <div className="absolute inset-0 z-0">
        <PageBackground intensity="high" />
      </div>
      <div className="container relative py-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>

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
                    {expert.company && <p className="text-gray-400 text-sm">Company: {expert.company}</p>}
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
              {/* Company Content */}
            </CardContent>
          </Card>
          <Card className="bg-gray-900/70 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">AI Event (will follow)</CardTitle>
            </CardHeader>
            <CardContent>
              {/* AI Event Content */}
            </CardContent>
          </Card>
        </div>

        <DashboardStats />

        <Tabs defaultValue="experts" className="mt-8">
          <TabsList className="bg-gray-900 border border-gray-700">
            <TabsTrigger value="experts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Experts
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
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
                <CardTitle className="text-white">Experts by Specialization</CardTitle>
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
                <CardDescription className="text-white">Most common AI specializations in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart type="specializations" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
