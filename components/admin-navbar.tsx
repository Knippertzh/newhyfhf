"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { Shield, Users, Settings, LogOut } from "lucide-react"

export default function AdminNavbar() {
  const { logout } = useAuth()

  return (
    <header className="border-b border-gray-800 bg-black/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="font-bold text-xl flex items-center text-white">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Admin Portal
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary text-white flex items-center px-3 py-2 rounded-md hover:bg-gray-800"
            >
              <Users className="h-4 w-4 mr-2" />
              User Management
            </Link>
            <Link
              href="/admin/system"
              className="text-sm font-medium transition-colors hover:text-primary text-white flex items-center px-3 py-2 rounded-md hover:bg-gray-800"
            >
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center bg-gray-900/70 border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

