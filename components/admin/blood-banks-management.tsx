"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Phone, MapPin, Droplet } from "lucide-react"
import {
  getBloodBanksList,
  createBloodBank,
  updateBloodBank,
  deleteBloodBank,
  type BloodBank,
} from "@/lib/admin-api"

interface BloodBanksManagementProps {
  token: string
}

interface FormData {
  name: string
  description: string
  phone: string
  location: string
  latitude: string
  longitude: string
  available_24_7: boolean
  blood_group_o_positive: number
  blood_group_o_negative: number
  blood_group_a_positive: number
  blood_group_a_negative: number
  blood_group_b_positive: number
  blood_group_b_negative: number
  blood_group_ab_positive: number
  blood_group_ab_negative: number
}

const BLOOD_GROUPS: Array<{ key: keyof FormData; label: string }> = [
  { key: "blood_group_o_positive", label: "O+" },
  { key: "blood_group_o_negative", label: "O-" },
  { key: "blood_group_a_positive", label: "A+" },
  { key: "blood_group_a_negative", label: "A-" },
  { key: "blood_group_b_positive", label: "B+" },
  { key: "blood_group_b_negative", label: "B-" },
  { key: "blood_group_ab_positive", label: "AB+" },
  { key: "blood_group_ab_negative", label: "AB-" },
]

export function BloodBanksManagement({ token }: BloodBanksManagementProps) {
  const [banks, setBanks] = useState<BloodBank[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    phone: "",
    location: "",
    latitude: "",
    longitude: "",
    available_24_7: true,
    blood_group_o_positive: 0,
    blood_group_o_negative: 0,
    blood_group_a_positive: 0,
    blood_group_a_negative: 0,
    blood_group_b_positive: 0,
    blood_group_b_negative: 0,
    blood_group_ab_positive: 0,
    blood_group_ab_negative: 0,
  })

  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    try {
      setLoading(true)
      const data = await getBloodBanksList(token)
      setBanks(data)
    } catch (error) {
      console.error("Error fetching blood banks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateBloodBank(token, editingId, formData)
      } else {
        await createBloodBank(token, formData)
      }
      resetForm()
      fetchBanks()
    } catch (error) {
      console.error("Error saving blood bank:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      phone: "",
      location: "",
      latitude: "",
      longitude: "",
      available_24_7: true,
      blood_group_o_positive: 0,
      blood_group_o_negative: 0,
      blood_group_a_positive: 0,
      blood_group_a_negative: 0,
      blood_group_b_positive: 0,
      blood_group_b_negative: 0,
      blood_group_ab_positive: 0,
      blood_group_ab_negative: 0,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (bank: BloodBank) => {
    setFormData({
      name: bank.name,
      description: bank.description || "",
      phone: bank.phone,
      location: bank.location || "",
      latitude: bank.latitude || "",
      longitude: bank.longitude || "",
      available_24_7: bank.available_24_7,
      blood_group_o_positive: bank.blood_group_o_positive,
      blood_group_o_negative: bank.blood_group_o_negative,
      blood_group_a_positive: bank.blood_group_a_positive,
      blood_group_a_negative: bank.blood_group_a_negative,
      blood_group_b_positive: bank.blood_group_b_positive,
      blood_group_b_negative: bank.blood_group_b_negative,
      blood_group_ab_positive: bank.blood_group_ab_positive,
      blood_group_ab_negative: bank.blood_group_ab_negative,
    })
    setEditingId(bank.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blood bank?")) {
      try {
        await deleteBloodBank(token, id)
        fetchBanks()
      } catch (error) {
        console.error("Error deleting blood bank:", error)
      }
    }
  }

  const getBloodInventory = (bank: BloodBank) => {
    return BLOOD_GROUPS.map((group) => ({
      label: group.label,
      quantity: bank[group.key as keyof BloodBank] as number,
    })).filter((item) => item.quantity > 0)
  }

  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Blood Banks</h1>
            <p className="text-slate-600 mt-2">Manage blood bank services and inventory</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              resetForm()
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Blood Bank
          </Button>
        </div>
      </motion.div>

      {showForm && (
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Blood Bank" : "Add New Blood Bank"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Bank Name"
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
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="border-t pt-4">
                <h3 className="font-semibold text-slate-900 mb-4">Blood Inventory (Units)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {BLOOD_GROUPS.map((group) => {
                    const value = formData[group.key]
                    return (
                      <Input
                        key={group.key}
                        placeholder={group.label}
                        type="number"
                        min="0"
                        value={String(value || 0)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [group.key]: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
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
          {banks.map((bank) => (
            <Card key={bank.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900">{bank.name}</h3>
                    {bank.description && <p className="text-slate-600 text-sm mt-1">{bank.description}</p>}

                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{bank.phone}</span>
                      </div>
                      {bank.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{bank.location}</span>
                        </div>
                      )}
                      {bank.available_24_7 && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">24/7</span>
                      )}
                    </div>

                    {getBloodInventory(bank).length > 0 && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplet className="w-4 h-4 text-red-500" />
                          <span className="font-semibold text-slate-900">Blood Inventory</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {getBloodInventory(bank).map((item) => (
                            <div key={item.label} className="text-sm">
                              <span className="font-medium text-slate-900">{item.label}:</span>
                              <span className="text-slate-600 ml-1">{item.quantity} units</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(bank)} className="gap-1">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(bank.id)} className="gap-1">
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
