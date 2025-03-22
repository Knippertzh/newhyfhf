import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Expert {
  id: string
  name: string
  title: string
  company: string
  specialization: string
  imageUrl?: string
  email?: string
}

interface ExpertCardProps {
  expert: Expert
}

export function ExpertCard({ expert }: ExpertCardProps) {
  // Generate avatar URL based on name if no image provided
  const avatarUrl =
    expert.imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=random&size=200&bold=true&color=fff`

  // Generate email if not provided (for demo purposes)
  const email = expert.email || `${expert.name.toLowerCase().replace(/\s/g, ".")}@example.com`

  return (
    <Card className="bg-gray-900/50 border-gray-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <div className="h-16 w-16 relative rounded-full overflow-hidden">
          <Image src={avatarUrl || "/placeholder.svg"} alt={expert.name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{expert.name}</h3>
          <p className="text-sm text-white">{expert.title}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-white">
            <span className="font-medium">Company:</span> {expert.company}
          </div>
          <div className="flex items-center gap-2 text-white">
            <span className="font-medium">Email:</span> {email}
          </div>
          <div className="mt-2">
            <Badge className="bg-primary/10 text-primary">{expert.specialization}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="dark-solid" className="w-full">
          <Link href={`/experts/${expert.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

