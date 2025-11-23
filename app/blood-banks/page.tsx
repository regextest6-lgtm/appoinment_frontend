"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { getBloodBanks } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Phone, MapPin, Clock, Droplet } from "lucide-react"

interface BloodBank {
  id: number
  name: string
  description: string
  phone: string
  location?: string
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

export default function BloodBanksPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [banks, setBanks] = useState<BloodBank[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(null)

  const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await getBloodBanks(false, selectedBloodGroup || undefined)
        setBanks(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching blood banks:", error)
        setBanks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanks()
  }, [selectedBloodGroup])

  const getBloodGroupInventory = (bank: BloodBank) => {
    return {
      "O+": bank.blood_group_o_positive,
      "O-": bank.blood_group_o_negative,
      "A+": bank.blood_group_a_positive,
      "A-": bank.blood_group_a_negative,
      "B+": bank.blood_group_b_positive,
      "B-": bank.blood_group_b_negative,
      "AB+": bank.blood_group_ab_positive,
      "AB-": bank.blood_group_ab_negative,
    }
  }

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
            Blood Banks
          </motion.h1>
          <p className="text-lg text-muted-foreground">Find blood banks and check blood availability</p>
        </div>
      </section>

      {/* Blood Group Filter */}
      <section className="w-full py-8 px-4 bg-slate-50 border-b">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedBloodGroup(null)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedBloodGroup === null
                  ? "bg-red-500 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-red-500"
              }`}
            >
              All Blood Groups
            </button>
            {bloodGroups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedBloodGroup(group)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedBloodGroup === group
                    ? "bg-red-500 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-red-500"
                }`}
              >
                <Droplet className="w-4 h-4" />
                {group}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Banks */}
      <section className="w-full py-20 px-4 flex-1">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : banks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No blood banks available</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {banks.map((bank) => {
                const inventory = getBloodGroupInventory(bank)
                return (
                  <motion.div key={bank.id} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                    <Card className="h-full p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-red-50/50">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-lg text-foreground flex-1">{bank.name}</h3>
                        {bank.available_24_7 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">24/7</span>
                        )}
                      </div>

                      {bank.description && (
                        <p className="text-muted-foreground text-sm mb-4">{bank.description}</p>
                      )}

                      <div className="space-y-3 mt-6 mb-6">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <a href={`tel:${bank.phone}`} className="text-sm font-medium hover:text-red-500 transition-colors">
                            {bank.phone}
                          </a>
                        </div>

                        {bank.location && (
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{bank.location}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <p className="text-sm">{bank.available_24_7 ? "Available 24/7" : "Limited hours"}</p>
                        </div>
                      </div>

                      {/* Blood Inventory */}
                      <div className="border-t border-border pt-4">
                        <p className="text-xs font-semibold text-foreground mb-3">Blood Inventory (Units)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {bloodGroups.map((group) => (
                            <div key={group} className="text-xs">
                              <span className="font-medium text-foreground">{group}:</span>
                              <span className={`ml-1 ${inventory[group as keyof typeof inventory] > 0 ? "text-green-600 font-semibold" : "text-red-600"}`}>
                                {inventory[group as keyof typeof inventory]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        Call Now
                      </button>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
