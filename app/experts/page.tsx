'use client';

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExpertCard } from "@/components/expert-card";
import Navbar from "@/components/navbar";
import PageBackground from "@/components/page-background";

import { debounce } from "lodash";

interface ExpertData {
  id: string;
  name: string;
  title: string;
  company: string;
  specialization: string;
  imageUrl?: string;
  email?: string;
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<ExpertData[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchSpecialization, setSearchSpecialization] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedFetchExperts = useCallback(
    debounce(async (name: string, specialization: string, company: string) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (specialization) params.append("specialization", specialization);
      if (company) params.append("company", company);

      try {
        const response = await fetch(`/api/experts?${params.toString()}`);
        const data = await response.json();
        setExperts(data);
      } catch (error) {
        console.error('Error fetching experts:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchExperts(searchName, searchSpecialization, searchCompany);
  }, [searchName, searchSpecialization, searchCompany, debouncedFetchExperts]);

  // Remove the fetchExperts function and Search button since search is now dynamic
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search by name"
                className="bg-gray-900/70 border-gray-700 text-white"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Input
                placeholder="Search by specialization"
                className="bg-gray-900/70 border-gray-700 text-white"
                value={searchSpecialization}
                onChange={(e) => setSearchSpecialization(e.target.value)}
              />
              <Input
                placeholder="Filter by company"
                className="bg-gray-900/70 border-gray-700 text-white"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
              />
              {loading && (
                <div className="col-span-1 md:col-span-4 text-center text-white">
                  Loading...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </div>
  );
}
