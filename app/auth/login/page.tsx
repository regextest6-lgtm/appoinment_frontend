"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { loginPatient, loginDoctor } from "@/lib/api"
import { Phone, Lock, AlertCircle, X } from "lucide-react"
import { TestCredentials } from "@/components/test-credentials"

interface LoginFormData {
  phone: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [userType, setUserType] = useState<"patient" | "doctor" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      phone: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      let response
      
      if (userType === "patient") {
        response = await loginPatient(data)
        login(response.user, response.access_token, response.refresh_token, "patient")
      } else if (userType === "doctor") {
        response = await loginDoctor(data)
        
        if (!response.user.is_doctor) {
          setMessageType("error")
          setSubmitMessage("This account is not registered as a doctor. Please contact admin.")
          setIsSubmitting(false)
          return
        }

        if (!response.user.is_active) {
          setMessageType("error")
          setSubmitMessage("Your doctor account has not been activated yet. Please contact admin.")
          setIsSubmitting(false)
          return
        }

        login(response.user, response.access_token, response.refresh_token, "doctor")
      }

      setMessageType("success")
      setSubmitMessage("Login successful! Redirecting...")
      setTimeout(() => {
        if (userType === "patient") {
          router.push("/dashboard/patient")
        } else {
          router.push("/dashboard/doctor")
        }
      }, 1500)
    } catch (error: any) {
      setMessageType("error")
      setSubmitMessage(error.message || "Login failed. Please check your credentials.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectUserType = (type: "patient" | "doctor") => {
    setUserType(type)
    reset()
    setSubmitMessage("")
  }

  const handleBack = () => {
    setUserType(null)
    reset()
    setSubmitMessage("")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="container mx-auto max-w-md">
          <AnimatePresence mode="wait">
            {!userType ? (
              // User Type Selection
              <motion.div
                key="selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-lg shadow-lg p-8 border border-border"
              >
                <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Login</h1>

                <div className="space-y-4">
                  {/* Patient Login Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectUserType("patient")}
                    className="w-full p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        Patient
                      </h3>
                      <div className="text-3xl">👤</div>
                    </div>
                  </motion.button>

                  {/* Doctor Login Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectUserType("doctor")}
                    className="w-full p-6 rounded-lg border-2 border-border hover:border-blue-500 hover:bg-blue-50/5 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                        Doctor
                      </h3>
                    </div>
                  </motion.button>
                </div>

                <div className="mt-8 text-center">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Login Form
              <motion.div
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-lg shadow-lg p-8 border border-border relative"
              >
                {/* Close Button */}
                <button
                  onClick={handleBack}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <span className="text-2xl">
                      {userType === "patient" ? "👤" : "👨‍⚕️"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {userType === "patient" ? "Patient Login" : "Doctor Login"}
                  </h1>
                  <p className="text-muted-foreground">
                    {userType === "patient"
                      ? "Access your healthcare account"
                      : "Access your professional dashboard"}
                  </p>
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
                    {errors.phone && (
                      <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>
                    )}
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
                    {errors.password && (
                      <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 font-medium text-white ${
                      userType === "patient"
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-muted-foreground text-sm">
                    {userType === "patient" ? (
                      <>
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium">
                          Register here
                        </Link>
                      </>
                    ) : (
                      <>
                        Don't have a doctor account?{" "}
                        <span className="text-muted-foreground">Contact admin</span>
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <TestCredentials />
    </div>
  )
}
