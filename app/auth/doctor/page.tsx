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
import { loginDoctor } from "@/lib/api"
import { Phone, Lock, AlertCircle } from "lucide-react"

interface LoginFormData {
  phone: string
  password: string
}

export default function DoctorLoginPage() {
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
      const response = await loginDoctor(data)

      // Check if user is a doctor
      if (!response.user.is_doctor) {
        setMessageType("error")
        setSubmitMessage("This account is not registered as a doctor. Please contact admin.")
        setIsSubmitting(false)
        return
      }

      // Check if doctor account is active
      if (!response.user.is_active) {
        setMessageType("error")
        setSubmitMessage("Your doctor account has not been activated yet. Please contact admin.")
        setIsSubmitting(false)
        return
      }

      login(response.user, response.access_token, response.refresh_token, "doctor")
      setMessageType("success")
      setSubmitMessage("Login successful! Redirecting...")
      setTimeout(() => router.push("/dashboard/doctor"), 2000)
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

      <section className="flex-1 py-20 px-4 bg-gradient-to-br from-blue-50/5 via-background to-blue-50/5">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg shadow-lg p-8 border border-border"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Portal</h1>
              <p className="text-muted-foreground">Access your professional dashboard</p>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium"
              >
                {isSubmitting ? "Logging in..." : "Login as Doctor"}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <div className="border-t border-border pt-3">
                <p className="text-muted-foreground text-sm mb-2">Don't have a doctor account?</p>
                <p className="text-muted-foreground text-xs">
                  Contact the admin to register as a doctor
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-muted-foreground text-sm mb-2">Other login options:</p>
                <div className="space-y-2">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Patient Login
                    </Button>
                  </Link>
                  <Link href="/auth/admin">
                    <Button variant="outline" className="w-full">
                      Admin Login
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
