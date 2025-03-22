"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AdminLoginButton() {
  const { adminLogin } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Use the adminLogin function from auth context
      await adminLogin(username, password)
      // If login is successful, the auth provider will handle the redirect
    } catch (err) {
      setError("Invalid admin credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="dark-outline" size="sm">
          <Shield className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black/80 backdrop-blur-md border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Admin Login</DialogTitle>
          <DialogDescription className="text-white">
            Enter your administrator credentials to access the system.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Sample Admin Credentials */}
        <div className="mb-4 p-3 bg-gray-800/70 rounded-md border border-gray-700">
          <p className="text-sm font-medium text-primary mb-2">Sample Admin Credentials:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white">
            <div>Username:</div>
            <div className="font-mono">admin</div>
            <div>Password:</div>
            <div className="font-mono">admin123</div>
          </div>
        </div>

        <form onSubmit={handleAdminLogin}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-username" className="text-white">
                Username
              </Label>
              <Input
                id="admin-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-900/70 border-gray-700 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password" className="text-white">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900/70 border-gray-700 text-white"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="font-medium bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

