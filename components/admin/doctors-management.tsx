"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { getDoctorsList, createDoctor, updateDoctor, deleteDoctor, getDepartmentsList } from "@/lib/admin-api"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Doctor {
  id: number
  user: {
    full_name: string
    phone?: string
    email?: string
  }
  specialty: string
  bio?: string
  profile_image_url?: string
  years_of_experience?: number
  department_id: number
}

interface Department {
  id: number
  name: string
}

interface DoctorsManagementProps {
  action?: string
}

export function DoctorsManagement({ action }: DoctorsManagementProps) {
  const { token } = useAuth()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [formData, setFormData] = useState({
    specialty: "",
    bio: "",
    years_of_experience: 0,
    department_id: "",
  })

  const itemsPerPage = 10

  useEffect(() => {
    fetchDoctors()
    fetchDepartments()
  }, [token])

  const fetchDoctors = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      const data = await getDoctorsList(token, currentPage * itemsPerPage, itemsPerPage)
      setDoctors(data || [])
    } catch (err) {
      console.error("Error fetching doctors:", err)
      setError("Failed to load doctors")
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    if (!token) return

    try {
      const data = await getDepartmentsList(token, 0, 100)
      setDepartments(data || [])
    } catch (err) {
      console.error("Error fetching departments:", err)
    }
  }

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setFormData({
      specialty: doctor.specialty,
      bio: doctor.bio || "",
      years_of_experience: doctor.years_of_experience || 0,
      department_id: doctor.department_id.toString(),
    })
    setShowForm(true)
  }

  const handleDelete = async (doctorId: number) => {
    if (!token || !confirm("Are you sure you want to delete this doctor?")) return

    try {
      await deleteDoctor(token, doctorId)
      setDoctors(doctors.filter((d) => d.id !== doctorId))
    } catch (err) {
      console.error("Error deleting doctor:", err)
      setError("Failed to delete doctor")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      if (editingDoctor) {
        await updateDoctor(token, editingDoctor.id, {
          ...formData,
          department_id: parseInt(formData.department_id),
        } as any)
      }
      setShowForm(false)
      setEditingDoctor(null)
      setFormData({ specialty: "", bio: "", years_of_experience: 0, department_id: "" })
      fetchDoctors()
    } catch (err) {
      console.error("Error saving doctor:", err)
      setError("Failed to save doctor")
    }
  }

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading doctors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Doctors Management</h1>
            <p className="text-slate-600 mt-1">Manage hospital doctors and their information</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setEditingDoctor(null)
              setFormData({ specialty: "", bio: "", years_of_experience: 0, department_id: "" })
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Doctor
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200"
          />
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                  <Input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g., Cardiology"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                  <Input
                    type="number"
                    value={formData.years_of_experience}
                    onChange={(e) => setFormData({ ...formData, years_of_experience: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Doctor bio..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingDoctor ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingDoctor(null)
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Doctors Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        {filteredDoctors.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No doctors found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Specialty</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Experience</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Contact</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{doctor.user.full_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{doctor.specialty}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{doctor.years_of_experience || 0}+ years</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="text-xs">{doctor.user.phone || "N/A"}</div>
                        <div className="text-xs text-slate-500">{doctor.user.email || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={doctors.length < itemsPerPage}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
