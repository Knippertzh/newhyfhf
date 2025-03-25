"use client"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Users, Globe } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateLogoUrl, getPlaceholderLogo } from "@/lib/logo-utils"

interface Company {
  id: string
  name: string
  description: string
  industry: string
  location: string
  logoUrl?: string
  website?: string
  expertCount: number
}

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  // Generate website domain if not provided (for demo purposes)
  const domain = company.website || `${company.name.toLowerCase().replace(/\s+/g, "")}.com`
  
  // Use our utility function to generate the logo URL
  const logoUrl = generateLogoUrl(company.website, company.name, company.logoUrl)

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="h-16 w-16 relative bg-white rounded-md p-2">
          <Image
            src={logoUrl}
            alt={company.name}
            fill
            className="object-contain"
            onError={(e) => {
              // Fallback to placeholder if logo fetch fails
              const target = e.target as HTMLImageElement
              target.src = getPlaceholderLogo(80, 80)
            }}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{company.name}</h3>
          <p className="text-sm text-white">{company.industry}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 text-white">{company.description}</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{company.location}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Users className="h-4 w-4 text-primary" />
            <span>{company.expertCount} experts</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Globe className="h-4 w-4 text-primary" />
            <a
              href={`https://${domain.replace(/^https?:\/\//, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {domain.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="dark-solid" className="w-full">
          <Link href={`/companies/${company.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

