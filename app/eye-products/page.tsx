"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { getEyeProducts } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { ShoppingCart, Tag } from "lucide-react"

interface EyeProduct {
  id: number
  name: string
  description: string
  category: string
  brand?: string
  price?: string
  image_url?: string
  stock_quantity: number
  is_available: boolean
}

export default function EyeProductsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [products, setProducts] = useState<EyeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ["Sunglasses", "Contact Lenses", "Eye Drops", "Frames", "Accessories"]

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getEyeProducts(selectedCategory || undefined)
        setProducts(data)
      } catch (error) {
        console.error("Error fetching eye products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

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
      <section className="w-full py-16 px-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Eye Products & Sunglasses
          </motion.h1>
          <p className="text-lg text-muted-foreground">Premium eyewear and eye care products</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="w-full py-8 px-4 bg-slate-50 border-b">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === null
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-blue-500"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-blue-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="w-full py-20 px-4 flex-1">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No products available in this category</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Product Image */}
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center">
                          <Tag className="w-12 h-12 text-blue-300 mx-auto mb-2" />
                          <p className="text-sm text-blue-400">No image</p>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-sm text-foreground line-clamp-2">{product.name}</h3>
                        {!product.is_available && (
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Out</span>
                        )}
                      </div>

                      <p className="text-xs text-blue-600 font-medium mb-2">{product.category}</p>

                      {product.brand && <p className="text-xs text-muted-foreground mb-2">Brand: {product.brand}</p>}

                      {product.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        {product.price && <span className="font-bold text-lg text-blue-600">{product.price}</span>}
                        <span className="text-xs text-muted-foreground">
                          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                        </span>
                      </div>

                      <button
                        disabled={!product.is_available}
                        className={`w-full py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                          product.is_available
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.is_available ? "Add to Cart" : "Unavailable"}
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
