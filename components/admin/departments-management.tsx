"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, X, Save } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface DepartmentsManagementProps {
  action: string | null
}

export function DepartmentsManagement({ action }: DepartmentsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const { data: departments, mutate } = useSWR("/api/departments", fetcher)

  const filteredDepartments = departments?.filter((dept: any) =>
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddDepartment = async () => {
    try {
      await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      mutate()
      setShowForm(false)
      setFormData({ name: "", description: "" })
    } catch (error) {
      console.error("Error adding department:", error)
    }
  }

  const handleDeleteDepartment = async (deptId: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await fetch(`/api/departments/${deptId}`, { method: "DELETE" })
        mutate()
      } catch (error) {
        console.error("Error deleting department:", error)
      }
    }
  }

  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Departments Management</h1>
            <p className="text-slate-600 mt-2">Create and manage hospital departments</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </Button>
        </div>
      </motion.div>

      {/* Add Department Form */}
      {showForm && (
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department Name</label>
              <Input
                placeholder="Cardiology"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <Input
                placeholder="Heart and cardiovascular diseases"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleAddDepartment} className="gap-2 bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4" />
              Save Department
            </Button>
            <Button onClick={() => setShowForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-slate-200"
        />
      </div>

      {/* Departments List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredDepartments?.map((dept: any) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDepartment(dept.id)}
                  className="flex-1 gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!filteredDepartments || filteredDepartments.length === 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <p className="text-center text-slate-500">No departments found. Add a new department to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
