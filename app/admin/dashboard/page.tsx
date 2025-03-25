import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminNavbar from "@/components/admin-navbar"
import PendingUsersList from "@/components/pending-users-list"
import UsersList from "@/components/users-list"
import StatsGrid from "@/components/stats-grid"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminDashboardPage() {
  // Client-side auth check is handled by the AuthProvider component
  // which will redirect non-admin users away from this page

  return (
    <Suspense fallback={<div className="text-white p-4">Loading admin dashboard...</div>}>
      <div className="min-h-screen bg-black">
        <AdminNavbar />
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

          <Tabs defaultValue="pending" className="mb-8">
            <TabsList className="bg-gray-900 border border-gray-700">
              <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                User Management
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                System Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Pending Registration Requests</CardTitle>
                  <CardDescription className="text-white">Review and approve user registration requests</CardDescription>
                </CardHeader>
                <CardContent>
  const pendingUsers = await prisma.user.findMany({ 
      where: { status: 'PENDING' },
      select: { id: true, email: true, createdAt: true }
    });

  const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, status: true },
      orderBy: { createdAt: 'desc' }
    });

  const stats = {
      totalUsers: await prisma.user.count(),
      activeUsers: await prisma.user.count({ where: { status: 'ACTIVE' } }),
      pendingUsers: await prisma.user.count({ where: { status: 'PENDING' } }),
      totalCompanies: await prisma.company.count()
    };

  return (
    <Suspense fallback={<div className="text-white p-4">Loading admin dashboard...</div>}>
      <div className="min-h-screen bg-black">
        <AdminNavbar />
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

          <Tabs defaultValue="pending" className="mb-8">
            <TabsList className="bg-gray-900 border border-gray-700">
              <TabsTrigger value="pending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                User Management
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                System Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Pending Registration Requests</CardTitle>
                  <CardDescription className="text-white">Review and approve user registration requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <PendingUsersList pendingUsers={pendingUsers} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">User Management</CardTitle>
                  <CardDescription className="text-white">Manage existing users and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    This section allows you to manage all users in the system, edit their details, and adjust their access
                    levels.
                  </p>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Registered Users</h3>
                    <UsersList users={users} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="mt-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">System Settings</CardTitle>
                  <CardDescription className="text-white">Configure system-wide settings and parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    This section allows you to configure global system settings, including security policies, data
                    retention, and more.
                  </p>
                  <StatsGrid stats={stats} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Suspense>
  );
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">User Management</CardTitle>
                  <CardDescription className="text-white">Manage existing users and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    This section allows you to manage all users in the system, edit their details, and adjust their access
                    levels.
                  </p>
                  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white">Registered Users</h3>
<UsersList users={await prisma.user.findMany({
      select: { id: true, email: true, role: true, status: true },
      orderBy: { createdAt: 'desc' }
    })} />
  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="mt-4">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">System Settings</CardTitle>
                  <CardDescription className="text-white">Configure system-wide settings and parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    This section allows you to configure global system settings, including security policies, data
                    retention, and more.
                  </p>
<StatsGrid stats={{
    totalUsers: await prisma.user.count(),
    activeUsers: await prisma.user.count({ where: { status: 'ACTIVE' } }),
    pendingUsers: await prisma.user.count({ where: { status: 'PENDING' } }),
    totalCompanies: await prisma.company.count()
  }} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Suspense>
  );
}
