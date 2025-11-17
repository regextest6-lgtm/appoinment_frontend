"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { loginAdmin } from "@/lib/api"
import { Phone, Lock, AlertCircle, Shield } from "lucide-react"

interface LoginFormData {
  phone: string
  password: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      const response = await loginAdmin(data)

      // Check if user is an admin
      if (!response.user.is_admin) {
        setMessageType("error")
        setSubmitMessage("This account does not have admin privileges.")
        setIsSubmitting(false)
        return
      }

      // Check if admin account is active
      if (!response.user.is_active) {
        setMessageType("error")
        setSubmitMessage("Your admin account has been deactivated.")
        setIsSubmitting(false)
        return
      }

      login(response.user, response.access_token, response.refresh_token, "admin")
      setMessageType("success")
      setSubmitMessage("Login successful! Redirecting to admin panel...")
      setTimeout(() => router.push("/dashboard/admin"), 2000)
    } catch (error: any) {
      setMessageType("error")
      setSubmitMessage(error.message || "Login failed. Please check your credentials.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 py-20 px-4 bg-gradient-to-br from-red-50/5 via-background to-red-50/5">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg shadow-lg p-8 border border-border"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <Shield size={24} className="text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Restricted access - Administrators only</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg text-sm flex gap-2 ${
                    messageType === "success"
                      ? "bg-green-100/20 text-green-700 border border-green-200"
                      : "bg-red-100/20 text-red-700 border border-red-200"
                  }`}
                >
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{submitMessage}</span>
                </motion.div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <Input
                  {...register("phone", { required: "Phone number is required" })}
                  placeholder="+1234567890"
                  className="bg-background border-border"
                />
                {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Lock size={16} /> Password
                </label>
                <Input
                  {...register("password", { required: "Password is required" })}
                  placeholder="••••••••"
                  type="password"
                  className="bg-background border-border"
                />
                {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 font-medium"
              >
                {isSubmitting ? "Logging in..." : "Login as Admin"}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <div className="border-t border-border pt-3">
                <p className="text-muted-foreground text-sm mb-2">Admin Features:</p>
                <ul className="text-muted-foreground text-xs space-y-1">
                  <li>✓ Manage doctors and departments</li>
                  <li>✓ View all appointments</li>
                  <li>✓ Manage services</li>
                  <li>✓ View contact messages</li>
                </ul>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-muted-foreground text-sm mb-2">Other login options:</p>
                <div className="space-y-2">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Patient Login
                    </Button>
                  </Link>
                  <Link href="/auth/doctor">
                    <Button variant="outline" className="w-full">
                      Doctor Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
