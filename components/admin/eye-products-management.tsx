"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, Tag } from "lucide-react"
import {
  getEyeProductsList,
  createEyeProduct,
  updateEyeProduct,
  deleteEyeProduct,
  type EyeProduct,
} from "@/lib/admin-api"

interface EyeProductsManagementProps {
  token: string
}

const CATEGORIES = ["Sunglasses", "Contact Lenses", "Eye Drops", "Frames", "Accessories"]

export function EyeProductsManagement({ token }: EyeProductsManagementProps) {
  const [products, setProducts] = useState<EyeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Sunglasses",
    brand: "",
    price: "",
    image_url: "",
    stock_quantity: 0,
    is_available: true,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getEyeProductsList(token)
      setProducts(data)
    } catch (error) {
      console.error("Error fetching eye products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateEyeProduct(token, editingId, formData)
      } else {
        await createEyeProduct(token, formData)
      }
      setFormData({
        name: "",
        description: "",
        category: "Sunglasses",
        brand: "",
        price: "",
        image_url: "",
        stock_quantity: 0,
        is_available: true,
      })
      setEditingId(null)
      setShowForm(false)
      fetchProducts()
    } catch (error) {
      console.error("Error saving eye product:", error)
    }
  }

  const handleEdit = (product: EyeProduct) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category,
      brand: product.brand || "",
      price: product.price || "",
      image_url: product.image_url || "",
      stock_quantity: product.stock_quantity,
      is_available: product.is_available,
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteEyeProduct(token, id)
        fetchProducts()
      } catch (error) {
        console.error("Error deleting eye product:", error)
      }
    }
  }

  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Eye Products</h1>
            <p className="text-slate-600 mt-2">Manage sunglasses and eye-related products</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                name: "",
                description: "",
                category: "Sunglasses",
                brand: "",
                price: "",
                image_url: "",
                stock_quantity: 0,
                is_available: true,
              })
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </motion.div>

      {showForm && (
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Eye Product" : "Add New Eye Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-md"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
                <Input
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
                <Input
                  placeholder="Stock Quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                />
                <span>Available for Purchase</span>
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
          {products.map((product) => (
            <Card key={product.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900">{product.name}</h3>
                    {product.description && <p className="text-slate-600 text-sm mt-1">{product.description}</p>}

                    <div className="flex flex-wrap gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{product.category}</span>
                      </div>
                      {product.brand && <span className="text-slate-600">Brand: {product.brand}</span>}
                      {product.price && <span className="font-bold text-blue-600">{product.price}</span>}
                      <span className="text-slate-600">Stock: {product.stock_quantity}</span>
                      {!product.is_available && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Unavailable</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
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
