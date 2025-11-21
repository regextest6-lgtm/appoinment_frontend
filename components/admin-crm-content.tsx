"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Search, Plus, Edit, Trash2, Eye, X, Save, Calendar, Users, Building2, Briefcase, MessageSquare, BarChart3, CheckCircle, AlertCircle } from "lucide-react"
import useSWR from "swr"
import { AmbulanceManagement } from "./ambulance-management"
import { EyeProductsManagement } from "./eye-products-management"
import { useAuth } from "@/lib/auth-context"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface AdminCRMContentProps {
  menu: string
  action: string
}

export function AdminCRMContent({ menu, action }: AdminCRMContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const { data: appointments } = useSWR("/api/appointments", fetcher)
  const { data: messages } = useSWR("/api/contact/messages", fetcher)
  const { data: doctors } = useSWR("/api/doctors", fetcher)
  const { data: departments } = useSWR("/api/departments", fetcher)

  const appointmentsArray = Array.isArray(appointments) ? appointments : []
  const messagesArray = Array.isArray(messages) ? messages : []
  const doctorsArray = Array.isArray(doctors) ? doctors : []
  const departmentsArray = Array.isArray(departments) ? departments : []

  const stats = [
    {
      label: "Total Appointments",
      value: appointmentsArray.length || 0,
      icon: Calendar,
      color: "from-blue-50 to-blue-100",
      bgColor: "bg-blue-500",
    },
    {
      label: "Confirmed",
      value: appointmentsArray.filter((a: any) => a.status === "confirmed").length || 0,
      icon: CheckCircle,
      color: "from-green-50 to-green-100",
      bgColor: "bg-green-500",
    },
    {
      label: "Pending",
      value: appointmentsArray.filter((a: any) => a.status === "pending").length || 0,
      icon: AlertCircle,
      color: "from-yellow-50 to-yellow-100",
      bgColor: "bg-yellow-500",
    },
    {
      label: "Total Messages",
      value: messagesArray.length || 0,
      icon: MessageSquare,
      color: "from-purple-50 to-purple-100",
      bgColor: "bg-purple-500",
    },
  ]

  // Dashboard Overview
  if (menu === "dashboard") {
    return (
      <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 mt-2">Welcome to your hospital management CRM</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br ${stat.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardDescription className="text-slate-600 text-xs">{stat.label}</CardDescription>
                        <CardTitle className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</CardTitle>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">API Status</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium text-green-600">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Database</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium text-green-600">Connected</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Doctors</span>
                  <span className="font-bold text-slate-900">{doctorsArray.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Total Departments</span>
                  <span className="font-bold text-slate-900">{departmentsArray.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Doctors Management
  if (menu === "doctors") {
    const filteredDoctors = doctors?.filter((doc: any) =>
      doc.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Doctors Management</h1>
              <p className="text-slate-600 mt-2">Register, activate, and manage doctor accounts</p>
            </div>
            {action === "register" && (
              <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Register New Doctor
              </Button>
            )}
          </div>
        </motion.div>

        {/* Add Form */}
        {showForm && action === "register" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-lg shadow-md p-6 border border-slate-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Register New Doctor</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input placeholder="Full Name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Phone" />
              <Input placeholder="Specialty" />
              <Input placeholder="Department" />
              <Input placeholder="Years of Experience" type="number" />
            </div>

            <div className="flex gap-3">
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4" />
                Save Doctor
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Search */}
        {action === "view" && (
          <>
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>

            {/* Doctors Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDoctors?.map((doctor: any, index: number) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-slate-200"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                        {doctor.user?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold">{doctor.user?.full_name}</h3>
                        <p className="text-sm text-blue-100">{doctor.specialty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="text-sm font-medium text-slate-900">{doctor.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Experience</p>
                      <p className="text-sm font-medium text-slate-900">{doctor.experience_years} years</p>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <Button variant="ghost" size="sm" className="flex-1 gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 gap-2 text-red-600">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    )
  }

  // Departments Management
  if (menu === "departments") {
    return (
      <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Departments Management</h1>
              <p className="text-slate-600 mt-2">Create and manage hospital departments</p>
            </div>
            {action === "add" && (
              <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            )}
          </div>
        </motion.div>

        {/* Add Form */}
        {showForm && action === "add" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-lg shadow-md p-6 border border-slate-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add New Department</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <Input placeholder="Department Name" />
              <Input placeholder="Description" />
            </div>

            <div className="flex gap-3">
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4" />
                Save Department
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Departments Grid */}
        {action === "view" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {departments?.map((dept: any, index: number) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-slate-200"
              >
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                  <h3 className="font-bold text-lg">{dept.name}</h3>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-sm text-slate-600">{dept.description}</p>

                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <Button variant="ghost" size="sm" className="flex-1 gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 gap-2 text-red-600">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    )
  }

  // Ambulance Services Management
  if (menu === "ambulance") {
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") || "" : ""
    return <AmbulanceManagement token={token} />
  }

  // Eye Products Management
  if (menu === "eye-products") {
    const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") || "" : ""
    return <EyeProductsManagement token={token} />
  }

  // Other menus - Coming Soon
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{menu.charAt(0).toUpperCase() + menu.slice(1)} Management</h1>
      </motion.div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <p className="text-center text-slate-500">{menu} management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
