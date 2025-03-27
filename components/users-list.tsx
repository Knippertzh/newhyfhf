"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Ban, Eye, Key, FileDown, CheckCircle, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import AddUserForm from "@/components/add-user-form"

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

export default function UsersList({ users: initialUsers }: UsersListProps) {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Function to refresh users list from the database
  const refreshUsers = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        toast({
          title: "Users refreshed",
          description: "User list has been updated with the latest data.",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to refresh users')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to refresh users',
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }
  
  // Handle user deletion
  const handleDelete = async () => {
    if (!selectedUser) return
    
    try {
      const response = await fetch(`/api/admin/users?userId=${selectedUser.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setUsers(users.filter(user => user.id !== selectedUser.id))
        toast({
          title: "User deleted",
          description: `User ${selectedUser.email} has been deleted successfully.`,
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete user',
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }
  
  // Handle user status change (suspend/activate)
  const handleStatusChange = async (user: User, action: 'suspend' | 'activate') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          action,
        }),
      })
      
      if (response.ok) {
        // Update local state
        setUsers(users.map(u => {
          if (u.id === user.id) {
            return { ...u, status: action === 'suspend' ? 'SUSPENDED' : 'ACTIVE' }
          }
          return u
        }))
        
        toast({
          title: action === 'suspend' ? "User suspended" : "User activated",
          description: `User ${user.email} has been ${action === 'suspend' ? 'suspended' : 'activated'} successfully.`,
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${action} user`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} user`,
        variant: "destructive",
      })
    }
  }
  
  // Handle password reset
  const handlePasswordReset = async () => {
    if (!selectedUser || !newPassword) return
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: 'resetPassword',
          newPassword,
        }),
      })
      
      if (response.ok) {
        toast({
          title: "Password reset",
          description: `Password for ${selectedUser.email} has been reset successfully.`,
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to reset password')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to reset password',
        variant: "destructive",
      })
    } finally {
      setIsPasswordDialogOpen(false)
      setSelectedUser(null)
      setNewPassword('')
    }
  }
  
  // Handle downloading user activity log
  const handleDownloadLog = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${user.id}`, {
        method: 'GET',
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Create a downloadable file with the logs
        const logContent = JSON.stringify(data.activityLogs, null, 2)
        const blob = new Blob([logContent], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `user-${user.id}-activity-log.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast({
          title: "Log downloaded",
          description: `Activity log for ${user.email} has been downloaded.`,
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to download user log')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to download user log',
        variant: "destructive",
      })
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <AddUserForm onUserAdded={refreshUsers} />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={refreshUsers} 
          disabled={isRefreshing}
          className="h-10 w-10 text-white hover:text-blue-400 hover:bg-blue-500/20"
          title="Refresh Users"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white">No users found</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Actions</TableHead>
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
                        : user.status === 'SUSPENDED'
                          ? 'bg-red-500/20 text-red-300 border-red-400'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-400'}
                    >
                      {user.status || 'PENDING'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:text-red-400 hover:bg-red-500/20"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteDialogOpen(true)
                        }}
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      {user.status === 'ACTIVE' ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:text-yellow-400 hover:bg-yellow-500/20"
                          onClick={() => handleStatusChange(user, 'suspend')}
                          title="Suspend User"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      ) : user.status === 'SUSPENDED' ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white hover:text-green-400 hover:bg-green-500/20"
                          onClick={() => handleStatusChange(user, 'activate')}
                          title="Activate User"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      ) : null}
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:text-blue-400 hover:bg-blue-500/20"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsReviewDialogOpen(true)
                        }}
                        title="Review User"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:text-purple-400 hover:bg-purple-500/20"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsPasswordDialogOpen(true)
                        }}
                        title="Reset Password"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:text-green-400 hover:bg-green-500/20"
                        onClick={() => handleDownloadLog(user)}
                        title="Download Activity Log"
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Are you sure you want to delete the user {selectedUser?.email}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Password Reset Dialog */}
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter a new password for user {selectedUser?.email}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-password" className="text-right">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="col-span-3 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsPasswordDialogOpen(false)
                  setNewPassword('')
                }}>
                  Cancel
                </Button>
                <Button onClick={handlePasswordReset} disabled={!newPassword}>
                  Reset Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* User Review Dialog */}
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Detailed information about {selectedUser?.email}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-400">Email:</div>
                  <div>{selectedUser?.email}</div>
                  
                  <div className="text-gray-400">Role:</div>
                  <div>{selectedUser?.role || 'USER'}</div>
                  
                  <div className="text-gray-400">Status:</div>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={selectedUser?.status === 'ACTIVE' 
                        ? 'bg-green-500/20 text-green-300 border-green-400' 
                        : selectedUser?.status === 'SUSPENDED'
                          ? 'bg-red-500/20 text-red-300 border-red-400'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-400'}
                    >
                      {selectedUser?.status || 'PENDING'}
                    </Badge>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}