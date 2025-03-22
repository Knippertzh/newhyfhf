import PreRegistrationForm from "@/components/pre-registration-form"
import LoginScene from "@/components/login-scene"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PreRegisterPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <LoginScene />
      </div>

      {/* Back to Login Button */}
      <div className="absolute top-4 left-4 z-20">
        <Button variant="dark-solid" size="sm" asChild>
          <Link href="/login">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </Button>
      </div>

      {/* Page Title */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Request Access
        </h1>
      </div>

      {/* Pre-Registration Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="w-full max-w-md px-4">
          <PreRegistrationForm />
        </div>
      </div>
    </div>
  )
}

