"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Stethoscope,
  Building2,
  Zap,
} from "lucide-react"
import {
  getDashboardStats,
  getAppointmentStats,
  getUserStats,
  getMessageStats,
  getSystemHealth,
  DashboardStats,
  AppointmentStats,
  UserStats,
  MessageStats,
  SystemHealth,
} from "@/lib/admin-api"
import { useAuth } from "@/lib/auth-context"

interface StatCard {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: string
  subtext?: string
}

export function DashboardOverview() {
  const { token } = useAuth()
  const [dashStats, setDashStats] = useState<DashboardStats | null>(null)
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [messageStats, setMessageStats] = useState<MessageStats | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    const fetchAllStats = async () => {
      if (!token) {
        setError("No authentication token found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const [dash, appt, usr, msg, health] = await Promise.all([
          getDashboardStats(token),
          getAppointmentStats(token),
          getUserStats(token),
          getMessageStats(token),
          getSystemHealth(token),
        ])

        setDashStats(dash)
        setAppointmentStats(appt)
        setUserStats(usr)
        setMessageStats(msg)
        setSystemHealth(health)
        setLastUpdated(new Date())
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchAllStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchAllStats, 30000)
    return () => clearInterval(interval)
  }, [token])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-medium">Error Loading Dashboard</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const mainStats: StatCard[] = [
    {
      title: "Total Appointments",
      value: dashStats?.total_appointments || 0,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      trend: `${dashStats?.confirmed_appointments || 0} confirmed`,
      subtext: "appointments",
    },
    {
      title: "Confirmed",
      value: dashStats?.confirmed_appointments || 0,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      trend: "this month",
      subtext: `${dashStats?.month_appointments || 0}`,
    },
    {
      title: "Pending",
      value: dashStats?.pending_appointments || 0,
      icon: <Clock className="w-6 h-6" />,
      color: "from-yellow-500 to-yellow-600",
      trend: "awaiting confirmation",
      subtext: "appointments",
    },
    {
      title: "Messages",
      value: dashStats?.pending_messages || 0,
      icon: <MessageSquare className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      trend: "new messages",
      subtext: "to review",
    },
  ]

  const resourceStats: StatCard[] = [
    {
      title: "Total Doctors",
      value: dashStats?.total_doctors || 0,
      icon: <Stethoscope className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      subtext: "active doctors",
    },
    {
      title: "Departments",
      value: dashStats?.total_departments || 0,
      icon: <Building2 className="w-6 h-6" />,
      color: "from-cyan-500 to-cyan-600",
      subtext: "departments",
    },
    {
      title: "Services",
      value: dashStats?.total_services || 0,
      icon: <Activity className="w-6 h-6" />,
      color: "from-pink-500 to-pink-600",
      subtext: "services",
    },
    {
      title: "Total Users",
      value: dashStats?.total_users || 0,
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      trend: `${dashStats?.active_users || 0} active`,
      subtext: "users",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Welcome back! Here's your hospital overview.</p>
          </div>
          {systemHealth && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">
                  {systemHealth.api_status === "operational" ? "System Operational" : "System Issues"}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {mainStats.map((card, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg text-white`}>
                  {card.icon}
                </div>
                {card.trend && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {card.trend}
                  </span>
                )}
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-4xl font-bold text-slate-900 mb-2">{card.value}</p>
              {card.subtext && <p className="text-xs text-slate-500">{card.subtext}</p>}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Resource Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {resourceStats.map((card, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg text-white`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-4xl font-bold text-slate-900 mb-2">{card.value}</p>
              {card.subtext && <p className="text-xs text-slate-500">{card.subtext}</p>}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Appointment Status Distribution */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Appointment Status
          </h2>
          <div className="space-y-3">
            {appointmentStats?.by_status &&
              Object.entries(appointmentStats.by_status).map(([status, count]: [string, any]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-slate-600 capitalize font-medium">{status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (count / (dashStats?.total_appointments || 1)) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-slate-900 font-semibold w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        {/* User Distribution */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            User Distribution
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Users</span>
              <span className="text-slate-900 font-semibold">{userStats?.total_users || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Active Users</span>
              <span className="text-slate-900 font-semibold">{userStats?.active_users || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Doctors</span>
              <span className="text-slate-900 font-semibold">{userStats?.doctor_users || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Patients</span>
              <span className="text-slate-900 font-semibold">{userStats?.patient_users || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Admins</span>
              <span className="text-slate-900 font-semibold">{userStats?.admin_users || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Message Status */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            Message Status
          </h2>
          <div className="space-y-3">
            {messageStats?.by_status &&
              Object.entries(messageStats.by_status).map(([status, count]: [string, any]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-slate-600 capitalize font-medium">{status}</span>
                  <span className="text-slate-900 font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Quick Stats
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">This Week</span>
              <span className="text-slate-900 font-semibold">{dashStats?.week_appointments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">This Month</span>
              <span className="text-slate-900 font-semibold">{dashStats?.month_appointments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Confirmed</span>
              <span className="text-slate-900 font-semibold">{dashStats?.confirmed_appointments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Pending Messages</span>
              <span className="text-slate-900 font-semibold">{dashStats?.pending_messages || 0}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Last Updated */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
        <p className="text-xs text-slate-500">
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "N/A"}
        </p>
      </motion.div>
    </div>
  )
}
