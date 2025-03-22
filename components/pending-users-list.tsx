"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

// Mock data for pending users
const mockPendingUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    company: "AI Research Inc.",
    role: "Data Scientist",
    requestDate: "2023-05-15T10:30:00Z",
    reason: "Need access to track AI experts in our field for potential collaboration.",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    company: "Tech Innovations",
    role: "CTO",
    requestDate: "2023-05-14T14:45:00Z",
    reason: "Looking to connect with AI experts for our new project on autonomous systems.",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    company: "University of AI",
    role: "Professor",
    requestDate: "2023-05-13T09:15:00Z",
    reason: "Academic research on AI expert networks and collaboration patterns.",
  },
]

type PendingUser = {
  id: string | number;
  name?: string;
  email: string;
  createdAt?: string | Date;
}

interface PendingUsersListProps {
  pendingUsers: PendingUser[];
}

export default function PendingUsersList({ pendingUsers: initialPendingUsers }: PendingUsersListProps) {
  const [pendingUsers, setPendingUsers] = useState(initialPendingUsers.length > 0 ? initialPendingUsers : mockPendingUsers)

  const handleApprove = (userId: string) => {
    // Mock API call to approve user
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId))
    // In a real app, you would make an API call to approve the user
  }

  const handleReject = (userId: string) => {
    // Mock API call to reject user
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId))
    // In a real app, you would make an API call to reject the user
  }

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      {pendingUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white">No pending registration requests</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Requested</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-white">{user.name}</TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">
                  {user.company || 'N/A'}
                  {user.role && (
                    <div className="mt-1">
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-white">{formatDate(user.createdAt || user.requestDate)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-600 font-medium"
                      onClick={() => handleApprove(user.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-600 font-medium"
                      onClick={() => handleReject(user.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

