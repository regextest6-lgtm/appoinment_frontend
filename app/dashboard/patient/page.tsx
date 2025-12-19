"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Calendar, FileText, User, LogOut, Clock, CheckCircle } from "lucide-react"

export default function PatientDashboard() {
  const router = useRouter()
  const { user, userType, logout, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || userType !== "patient")) {
      router.push("/auth/login")
    }
  }, [user, userType, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || userType !== "patient") {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="w-full py-12 px-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {user.full_name || "Patient"}</h1>
              <p className="text-muted-foreground">Manage your appointments here.</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-20 px-4">
        <div className="container mx-auto">
          {/* Quick Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div variants={itemVariants}>
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Upcoming Appointments</p>
                    <p className="text-3xl font-bold text-foreground">2</p>
                  </div>
                  <Calendar className="w-12 h-12 text-primary/20" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Completed Appointments</p>
                    <p className="text-3xl font-bold text-foreground">5</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-500/20" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Medical Records</p>
                    <p className="text-3xl font-bold text-foreground">3</p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-500/20" />
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Book Appointment */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Book Appointment</h3>
                    <p className="text-muted-foreground">Schedule a consultation with our doctors</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <Link href="/appointment">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Book Now
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* My Appointments */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">My Appointments</h3>
                    <p className="text-muted-foreground">View and manage your appointments</p>
                  </div>
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <Button variant="outline" className="w-full">
                  View Appointments
                </Button>
              </Card>
            </motion.div>

            {/* Medical Records */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Medical Records</h3>
                    <p className="text-muted-foreground">Access your health records and documents</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <Button variant="outline" className="w-full">
                  View Records
                </Button>
              </Card>
            </motion.div>

            {/* Profile Settings */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Profile Settings</h3>
                    <p className="text-muted-foreground">Update your personal information</p>
                  </div>
                  <User className="w-8 h-8 text-primary" />
                </div>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </Card>
            </motion.div>
          </motion.div>

          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="p-6 border-0 shadow-lg bg-muted/50">
              <h3 className="font-bold text-lg text-foreground mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium text-foreground">{user.full_name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium text-foreground">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground">{user.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Account Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
