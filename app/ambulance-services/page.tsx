"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { getAmbulanceServices } from "@/lib/api"
import { Phone, MapPin, Clock } from "lucide-react"

interface AmbulanceService {
  id: number
  name: string
  description: string
  phone: string
  location?: string
  available_24_7: boolean
  ambulance_count: number
}

export default function AmbulanceServicesPage() {
  const [services, setServices] = useState<AmbulanceService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAmbulanceServices()
        setServices(data)
      } catch (error) {
        console.error("Error fetching ambulance services:", error)
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
      <section className="w-full py-16 px-4 bg-gradient-to-r from-red-500/10 to-red-600/10">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Ambulance Services
          </motion.h1>
          <p className="text-lg text-muted-foreground">Emergency medical transportation available 24/7</p>
        </div>
      </section>

      {/* Services */}
      <section className="w-full py-20 px-4 flex-1">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No ambulance services available</p>
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
                  <Card className="h-full p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-red-50/50">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-lg text-foreground flex-1">{service.name}</h3>
                      {service.available_24_7 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">24/7</span>
                      )}
                    </div>

                    {service.description && (
                      <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    )}

                    <div className="space-y-3 mt-6">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <a href={`tel:${service.phone}`} className="text-sm font-medium hover:text-red-500 transition-colors">
                          {service.phone}
                        </a>
                      </div>

                      {service.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{service.location}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm">
                          {service.ambulance_count} ambulance{service.ambulance_count !== 1 ? "s" : ""} available
                        </p>
                      </div>
                    </div>

                    <button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      Call Now
                    </button>
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
