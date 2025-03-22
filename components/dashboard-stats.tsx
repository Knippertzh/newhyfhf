import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, Briefcase, Award } from "lucide-react"

export function DashboardStats() {
  // Mock data - replace with actual data fetching
  const stats = {
    totalExperts: 54,
    totalCompanies: 28,
    activeProjects: 42,
    topSpecialization: "Machine Learning",
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Experts</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalExperts}</div>
          <p className="text-xs text-white">AI professionals in database</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Companies</CardTitle>
          <Building className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalCompanies}</div>
          <p className="text-xs text-white">AI companies tracked</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Active Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
          <p className="text-xs text-white">Ongoing AI initiatives</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Top Specialization</CardTitle>
          <Award className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.topSpecialization}</div>
          <p className="text-xs text-white">Most common expertise</p>
        </CardContent>
      </Card>
    </div>
  )
}

