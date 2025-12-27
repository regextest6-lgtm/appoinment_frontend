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
import { loginPatient } from "@/lib/api"
import { Phone, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"

interface LoginFormData {
  phone: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [showPassword, setShowPassword] = useState(false)

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
      const response = await loginPatient(data)
      login(response.user, response.access_token, response.refresh_token, "patient")

      setMessageType("success")
      setSubmitMessage("Login successful! Redirecting...")
      setTimeout(() => {
        router.push("/dashboard/patient")
      }, 1500)
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

      <section className="flex-1 py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg shadow-lg p-8 border border-border"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Patient Login</h1>
              <p className="text-muted-foreground">Sign in to your healthcare account</p>
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
                  placeholder="01700000000"
                  className="bg-background border-border"
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Lock size={16} /> Password
                </label>
                <div className="relative">
                  <Input
                    {...register("password", { required: "Password is required" })}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="bg-background border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 font-medium text-white bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
