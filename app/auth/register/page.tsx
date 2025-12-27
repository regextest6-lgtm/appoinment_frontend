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
import { Mail, Phone, Lock, User, MapPin, AlertCircle, Eye, EyeOff } from "lucide-react"

interface RegisterFormData {
  full_name?: string
  email?: string
  phone: string
  password: string
  confirmPassword: string
  nid?: string
  date_of_birth?: string
  gender?: string
  blood_group?: string
  division?: string
  district?: string
  upazila?: string
  village?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [activeTab, setActiveTab] = useState<"account" | "personal" | "location" | "emergency">("account")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const tabs = [
    { id: "account", label: "Account", icon: Lock },
    { id: "personal", label: "Personal", icon: User },
    { id: "location", label: "Location", icon: MapPin },
    { id: "emergency", label: "Emergency", icon: AlertCircle },
  ] as const

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setMessageType("error")
      setSubmitMessage("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    try {
      // Filter out empty strings and undefined values
      const cleanData = Object.fromEntries(
        Object.entries({
          phone: data.phone,
          password: data.password,
          full_name: data.full_name,
          email: data.email,
          nid: data.nid,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          blood_group: data.blood_group,
          division: data.division,
          district: data.district,
          upazila: data.upazila,
          village: data.village,
          address: data.address,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_phone: data.emergency_contact_phone,
        }).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
      )

      const response = await registerPatient(cleanData as any)

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
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg shadow-lg p-8 border border-border"
          >
            <h1 className="text-3xl font-bold text-foreground mb-6 text-center">Create Account</h1>

            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg text-sm mb-4 ${
                  messageType === "success"
                    ? "bg-green-100/20 text-green-700 border border-green-200"
                    : "bg-red-100/20 text-red-700 border border-red-200"
                }`}
              >
                {submitMessage}
              </motion.div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Account Tab */}
              {activeTab === "account" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <User size={16} /> Full Name <span className="text-muted-foreground text-xs">(Optional)</span>
                    </label>
                    <Input
                      {...register("full_name")}
                      placeholder="Enter your name"
                      className="bg-background border-border"
                    />
                    {errors.full_name && <span className="text-red-500 text-xs mt-1">{errors.full_name.message}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Mail size={16} /> Email <span className="text-muted-foreground text-xs">(Optional)</span>
                    </label>
                    <Input
                      {...register("email", {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                      placeholder="email@example.com"
                      type="email"
                      className="bg-background border-border"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Phone size={16} /> Phone Number
                    </label>
                    <Input
                      {...register("phone", { required: "Phone number is required" })}
                      placeholder="01700000000"
                      className="bg-background border-border"
                    />
                    {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Lock size={16} /> Password
                    </label>
                    <div className="relative">
                      <Input
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        placeholder="••••••••"
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
                    {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                    <p className="text-xs text-muted-foreground mt-1">Min 8 chars, uppercase, lowercase, digit (max 72 bytes)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Lock size={16} /> Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) => value === password || "Passwords do not match",
                        })}
                        placeholder="••••••••"
                        type={showConfirmPassword ? "text" : "password"}
                        className="bg-background border-border pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Personal Tab */}
              {activeTab === "personal" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">National ID (NID)</label>
                    <Input
                      {...register("nid")}
                      placeholder="Enter your NID"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                    <Input
                      {...register("date_of_birth")}
                      type="date"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                    <select
                      {...register("gender")}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Blood Group</label>
                    <select
                      {...register("blood_group")}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Location Tab */}
              {activeTab === "location" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Division</label>
                    <select
                      {...register("division")}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                    >
                      <option value="">Select Division</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">District</label>
                    <Input
                      {...register("district")}
                      placeholder="Enter your district"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Upazila</label>
                    <Input
                      {...register("upazila")}
                      placeholder="Enter your upazila"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Village/Area</label>
                    <Input
                      {...register("village")}
                      placeholder="Enter your village or area"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Address</label>
                    <textarea
                      {...register("address")}
                      placeholder="Enter your full address"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}

              {/* Emergency Tab */}
              {activeTab === "emergency" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Emergency Contact Name</label>
                    <Input
                      {...register("emergency_contact_name")}
                      placeholder="Enter emergency contact name"
                      className="bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Emergency Contact Phone</label>
                    <Input
                      {...register("emergency_contact_phone")}
                      placeholder="Enter emergency contact phone"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Emergency contact information will be used in case of medical emergencies.
                    </p>
                  </div>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 font-medium mt-6"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                  Sign in here
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
