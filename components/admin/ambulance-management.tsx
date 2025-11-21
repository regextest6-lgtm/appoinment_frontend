"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Phone, MapPin } from "lucide-react"
import {
  getAmbulanceServicesList,
  createAmbulanceService,
  updateAmbulanceService,
  deleteAmbulanceService,
  type AmbulanceService,
} from "@/lib/admin-api"

interface AmbulanceManagementProps {
  token: string
}

export function AmbulanceManagement({ token }: AmbulanceManagementProps) {
  const [services, setServices] = useState<AmbulanceService[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    location: "",
    latitude: "",
    longitude: "",
    available_24_7: true,
    ambulance_count: 1,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await getAmbulanceServicesList(token)
      setServices(data)
    } catch (error) {
      console.error("Error fetching ambulance services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateAmbulanceService(token, editingId, formData)
      } else {
        await createAmbulanceService(token, formData)
      }
      setFormData({
        name: "",
        description: "",
        phone: "",
        location: "",
        latitude: "",
        longitude: "",
        available_24_7: true,
        ambulance_count: 1,
      })
      setEditingId(null)
      setShowForm(false)
      fetchServices()
    } catch (error) {
      console.error("Error saving ambulance service:", error)
    }
  }

  const handleEdit = (service: AmbulanceService) => {
    setFormData({
      name: service.name,
      description: service.description || "",
      phone: service.phone,
      location: service.location || "",
      latitude: service.latitude || "",
      longitude: service.longitude || "",
      available_24_7: service.available_24_7,
      ambulance_count: service.ambulance_count,
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this ambulance service?")) {
      try {
        await deleteAmbulanceService(token, id)
        fetchServices()
      } catch (error) {
        console.error("Error deleting ambulance service:", error)
      }
    }
  }

  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Ambulance Services</h1>
            <p className="text-slate-600 mt-2">Manage emergency ambulance services</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                name: "",
                description: "",
                phone: "",
                location: "",
                latitude: "",
                longitude: "",
                available_24_7: true,
                ambulance_count: 1,
              })
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>
      </motion.div>

      {showForm && (
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Ambulance Service" : "Add New Ambulance Service"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Service Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <Input
                  placeholder="Ambulance Count"
                  type="number"
                  min="1"
                  value={formData.ambulance_count}
                  onChange={(e) => setFormData({ ...formData, ambulance_count: parseInt(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
                <Input
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.available_24_7}
                  onChange={(e) => setFormData({ ...formData, available_24_7: e.target.checked })}
                />
                <span>Available 24/7</span>
              </label>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900">{service.name}</h3>
                    {service.description && <p className="text-slate-600 text-sm mt-1">{service.description}</p>}

                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{service.phone}</span>
                      </div>
                      {service.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{service.location}</span>
                        </div>
                      )}
                      <span className="text-slate-600">{service.ambulance_count} ambulances</span>
                      {service.available_24_7 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">24/7</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      className="gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                      className="gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
