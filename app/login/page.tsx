import LoginForm from "@/components/login-form"
import PageBackground from "@/components/page-background"
import AdminLoginButton from "@/components/admin-login-button"

export default function LoginPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black mt-3">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <PageBackground intensity="high" />
      </div>

      {/* Page Title */}
      <div className="absolute top-0 left-0 right-0 text-center z-10">
        <img src="/logo.png" alt="Logo" className="h-24 w-auto mb-2 mx-auto" />
      </div>

      {/* Admin Login Button */}
      <div className="absolute top-4 right-4 z-20">
        <AdminLoginButton />
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-center mt-8">
        <div className="w-full max-w-md px-4">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
