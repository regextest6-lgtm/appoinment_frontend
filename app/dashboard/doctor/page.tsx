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
import { Calendar, Users, Clock, LogOut, CheckCircle, AlertCircle } from "lucide-react"

export default function DoctorDashboard() {
  const router = useRouter()
  const { user, userType, logout, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || userType !== "doctor")) {
      router.push("/auth/doctor")
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

  if (!user || userType !== "doctor") {
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
      <section className="w-full py-12 px-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Dr. {user.full_name || "Doctor"}</h1>
              <p className="text-muted-foreground">Manage your appointments and patient care</p>
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
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <motion.div variants={itemVariants}>
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Today's Appointments</p>
                    <p className="text-3xl font-bold text-foreground">4</p>
                  </div>
                  <Calendar className="w-12 h-12 text-blue-500/20" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Patients</p>
                    <p className="text-3xl font-bold text-foreground">28</p>
                  </div>
                  <Users className="w-12 h-12 text-green-500/20" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Completed Today</p>
                    <p className="text-3xl font-bold text-foreground">2</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-500/20" />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Pending Reviews</p>
                    <p className="text-3xl font-bold text-foreground">3</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-yellow-500/20" />
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            {/* Today's Schedule */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Today's Schedule</h3>
                    <p className="text-muted-foreground">View and manage today's appointments</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View Schedule
                </Button>
              </Card>
            </motion.div>

            {/* My Patients */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">My Patients</h3>
                    <p className="text-muted-foreground">Manage your patient list</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <Button variant="outline" className="w-full">
                  View Patients
                </Button>
              </Card>
            </motion.div>

            {/* Appointments */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">All Appointments</h3>
                    <p className="text-muted-foreground">View all your appointments</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </Card>
            </motion.div>

            {/* Medical Records */}
            <motion.div variants={itemVariants}>
              <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Patient Records</h3>
                    <p className="text-muted-foreground">Access patient medical records</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-blue-600" />
                </div>
                <Button variant="outline" className="w-full">
                  View Records
                </Button>
              </Card>
            </motion.div>
          </motion.div>

          {/* Doctor Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 border-0 shadow-lg bg-muted/50">
              <h3 className="font-bold text-lg text-foreground mb-4">Doctor Information</h3>
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
