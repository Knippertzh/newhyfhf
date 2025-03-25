"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type User = {
  id: string | number
  name?: string
  email: string
  role?: string
  status?: string
}

interface UsersListProps {
  users: User[]
}

export default function UsersList({ users }: UsersListProps) {
  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white">No users found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Role</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-white">{user.name || 'N/A'}</TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400">
                    {user.role || 'USER'}
                  </Badge>
                </TableCell>
                <TableCell className="text-white">
                  <Badge 
                    variant="outline" 
                    className={user.status === 'ACTIVE' 
                      ? 'bg-green-500/20 text-green-300 border-green-400' 
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-400'}
                  >
                    {user.status || 'PENDING'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}