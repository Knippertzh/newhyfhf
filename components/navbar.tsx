"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "./auth-provider"
import { LogOut, User } from "lucide-react"

export default function Navbar() {
  const { logout, user } = useAuth()

  return (
    <header className="border-b border-gray-800 bg-black/90 backdrop-blur-md z-10 relative">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="h-12">
            <img src="/logo.png" alt="Logo" className="h-12" />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary text-white">
              Dashboard
            </Link>
            <Link href="/experts" className="text-sm font-medium transition-colors hover:text-primary text-white">
              Experts
            </Link>
            <Link href="/companies" className="text-sm font-medium transition-colors hover:text-primary text-white">
              Companies
            </Link>
            <Link href="/ai-news" className="text-sm font-medium transition-colors hover:text-primary text-white">
              AI-News
            </Link>
            <Link href="/ai-tools" className="text-sm font-medium transition-colors hover:text-primary text-white">
              AI-Tools
            </Link>
            <Link href="/ai-management" className="text-sm font-medium transition-colors hover:text-primary text-white">
              AI-Management
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-white flex items-center mr-2">
            <User className="h-4 w-4 mr-2" />
            {user?.name || "User"}
          </div>
          <ModeToggle />
          <Button variant="dark-outline" size="sm" onClick={logout} className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button asChild className="bg-purple-600 text-white hover:bg-purple-700">
            <Link href="/experts/new">Add Expert</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
