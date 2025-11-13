"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Clock, DollarSign } from "lucide-react"

interface Service {
  id: number
  name: string
  description: string
  category: string
  price: number
  duration: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services")
        const data = await res.json()
        setServices(data)
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const categories = ["All", ...new Set(services.map((s) => s.category))]
  const filteredServices =
    selectedCategory === "All" ? services : services.filter((s) => s.category === selectedCategory)

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
      <section className="w-full py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Our Services
          </motion.h1>
          <p className="text-lg text-muted-foreground">Complete range of medical services and treatments</p>
        </div>
      </section>

      {/* Filter */}
      <section className="w-full py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-foreground hover:border-primary"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="w-full py-20 px-4 flex-1">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredServices.map((service) => (
                <motion.div key={service.id} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                  <Card className="h-full p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-primary/5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                          {service.category}
                        </span>
                        <h3 className="font-bold text-lg text-foreground">{service.name}</h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-6">{service.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={16} />
                        <span className="text-sm">{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <DollarSign size={16} />
                        <span>{service.price}</span>
                      </div>
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
