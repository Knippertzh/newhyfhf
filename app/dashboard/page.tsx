import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardChart } from "@/components/dashboard-chart"
import { DashboardStats } from "@/components/dashboard-stats"
import Navbar from "@/components/navbar"
import PageBackground from "@/components/page-background"

export default function DashboardPage() {
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
              <CardTitle className="text-white">Random AI Expert Example</CardTitle>
            </CardHeader>
            <CardContent>
              {/* AI Expert Content */}
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
