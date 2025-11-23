"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { getServices } from "@/lib/api"

interface Service {
  id: number
  name: string
  description: string
  icon?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        console.error("Error fetching services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

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

      {/* Services */}
      <section className="w-full py-20 px-4 flex-1">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No services available</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services.map((service) => (
                <motion.div key={service.id} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                  <Card className="h-full p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-primary/5">
                    <h3 className="font-bold text-lg text-foreground mb-3">{service.name}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
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
