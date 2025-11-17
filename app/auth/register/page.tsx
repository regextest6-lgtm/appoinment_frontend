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
import { registerPatient } from "@/lib/api"
import { Mail, Phone, Lock, User } from "lucide-react"

interface RegisterFormData {
  full_name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setMessageType("error")
      setSubmitMessage("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await registerPatient({
        phone: data.phone,
        password: data.password,
        full_name: data.full_name,
        email: data.email,
      })

      login(response.user, response.access_token, response.refresh_token, "patient")
      setMessageType("success")
      setSubmitMessage("Registration successful! Redirecting...")
      setTimeout(() => router.push("/dashboard/patient"), 2000)
    } catch (error: any) {
      setMessageType("error")
      setSubmitMessage(error.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg shadow-lg p-8 border border-border"
          >
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Register</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg text-sm ${
                    messageType === "success"
                      ? "bg-green-100/20 text-green-700 border border-green-200"
                      : "bg-red-100/20 text-red-700 border border-red-200"
                  }`}
                >
                  {submitMessage}
                </motion.div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <Input
                  {...register("full_name", { required: "Full name is required" })}
                  placeholder="John Doe"
                  className="bg-background border-border"
                />
                {errors.full_name && <span className="text-red-500 text-xs mt-1">{errors.full_name.message}</span>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <Input
                  {...register("email", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="john@example.com"
                  type="email"
                  className="bg-background border-border"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
              </div>

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
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="••••••••"
                  type="password"
                  className="bg-background border-border"
                />
                {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                <p className="text-xs text-muted-foreground mt-1">
                  Min 8 chars, uppercase, lowercase, digit, special char
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Lock size={16} /> Confirm Password
                </label>
                <Input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  placeholder="••••••••"
                  type="password"
                  className="bg-background border-border"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 font-medium"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                  Login
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
