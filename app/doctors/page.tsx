"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Search } from "lucide-react"

interface Doctor {
  id: number
  name: string
  specialty: string
  bio: string
  imageUrl: string
  experienceYears: number
  phone: string
  email: string
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, deptRes] = await Promise.all([fetch("/api/doctors"), fetch("/api/departments")])

        const doctorsData = await doctorsRes.json()
        const departmentsData = await deptRes.json()

        setDoctors(doctorsData)

        // Extract unique specialties from doctors
        const uniqueSpecialties = [...new Set(doctorsData.map((d: Doctor) => d.specialty))]
        setDepartments(uniqueSpecialties as string[])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = () => {
    let results = doctors

    // Filter by department if selected
    if (selectedDepartment) {
      results = results.filter((d) => d.specialty === selectedDepartment)
    }

    // Filter by doctor name if provided
    if (doctorName.trim()) {
      results = results.filter((d) => d.name.toLowerCase().includes(doctorName.toLowerCase()))
    }

    setFilteredDoctors(results)
  }

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Initial load - show all doctors
  useEffect(() => {
    if (doctors.length > 0) {
      setFilteredDoctors(doctors)
    }
  }, [doctors])

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
            Our Doctors
          </motion.h1>
          <p className="text-lg text-muted-foreground">Meet our team of expert healthcare professionals</p>
        </div>
      </section>

      <section className="w-full py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Department Dropdown */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-foreground mb-2">Select Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Name Search Input */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-foreground mb-2">Search by Doctor Name</label>
              <input
                type="text"
                placeholder="Enter doctor name..."
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all h-10 md:mt-6"
            >
              <Search size={18} />
              Search
            </motion.button>
          </div>
        </div>
      </section>

      {/* Doctors List */}
      <section className="w-full py-20 px-4 flex-1">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No doctors found matching your search criteria.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredDoctors.map((doctor) => (
                <motion.div key={doctor.id} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <div className="relative h-72 overflow-hidden bg-muted">
                      <Image
                        src={doctor.imageUrl || "/placeholder.svg"}
                        alt={doctor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-foreground mb-1">{doctor.name}</h3>
                      <p className="text-primary font-medium mb-3">{doctor.specialty}</p>
                      <p className="text-sm text-muted-foreground mb-4">{doctor.bio}</p>
                      <div className="space-y-2 mb-4 pb-4 border-b border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone size={16} />
                          <span>{doctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail size={16} />
                          <span className="truncate">{doctor.email}</span>
                        </div>
                      </div>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href={`/doctors/${doctor.id}`}>View Details</Link>
                      </Button>
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
