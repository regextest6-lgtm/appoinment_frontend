"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Search } from "lucide-react"
import { getDoctors, getDepartments, getDoctorsByDepartment } from "@/lib/api"

interface Doctor {
  id: number
  name: string
  email?: string
  phone?: string
  specialty: string
  department_id: number
  bio?: string
  image_url?: string
  experience_years?: number
  is_available: boolean
  is_active: boolean
  profile_data?: {
    degrees?: string[]
    workplace?: string
    visiting_schedule?: Array<{ day: string; time: string }>
    treats?: string[]
  }
  created_at: string
  updated_at: string
}

export default function DoctorsPage() {
  const searchParams = useSearchParams()
  const deptParam = searchParams.get("dept")
  
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState(deptParam || "")
  const [doctorName, setDoctorName] = useState("")
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let doctorsData: Doctor[] = []
        
        // If dept parameter is provided, fetch doctors for that department
        if (deptParam) {
          console.log("Fetching doctors for department:", deptParam)
          const deptDoctorsData = await getDoctorsByDepartment(parseInt(deptParam)) as Doctor[]
          doctorsData = Array.isArray(deptDoctorsData) ? deptDoctorsData : []
        } else {
          // Otherwise fetch all doctors
          const allDoctorsData = await getDoctors()
          doctorsData = Array.isArray(allDoctorsData) ? allDoctorsData : []
        }
        
        console.log("Doctors data:", doctorsData)
        
        // Filter out doctors with invalid data structure
        const validDoctors = doctorsData.filter(
          (d: Doctor) => d && d.name && d.id
        ) as Doctor[]

        setDoctors(validDoctors)

        // Fetch departments
        const departmentsData = await getDepartments()
        if (departmentsData && Array.isArray(departmentsData)) {
          setDepartments(departmentsData as { id: number; name: string }[])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setDoctors([])
        setDepartments([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [deptParam])

  const handleSearch = () => {
    let results = doctors

    // Filter by department if selected
    if (selectedDepartment) {
      results = results.filter((d) => d.department_id === parseInt(selectedDepartment))
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

  // Update filtered doctors when doctors or selectedDepartment changes
  useEffect(() => {
    if (doctors.length > 0) {
      let results = doctors

      // Filter by department if selected
      if (selectedDepartment) {
        results = results.filter((d) => d.department_id === parseInt(selectedDepartment))
      }

      // Filter by doctor name if provided
      if (doctorName.trim()) {
        results = results.filter((d) => d.name.toLowerCase().includes(doctorName.toLowerCase()))
      }

      setFilteredDoctors(results)
    }
  }, [doctors, selectedDepartment, doctorName])

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
      <section className="w-full py-16 px-4 bg-linear-to-r from-primary/10 to-accent/10">
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
                  <option key={dept.id} value={dept.id.toString()}>
                    {dept.name}
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredDoctors.map((doctor) => (
                <motion.div key={doctor.id} variants={itemVariants} whileHover={{ y: -8 }} className="group cursor-pointer">
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col py-0">
                    {/* Image Container - Larger */}
                    <div className="relative w-full aspect-square overflow-hidden bg-muted shrink-0">
                      <Image
                        src={doctor.image_url || "/placeholder.svg"}
                        alt={doctor.name}
                        fill
                        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
                        priority={false}
                        className="mt-4 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Content Container */}
                    <div className="p-6 flex flex-col grow">
                      <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">{doctor.name}</h3>
                      
                      {doctor.profile_data?.degrees && doctor.profile_data.degrees.length > 0 && (
                        <p className="text-sm text-primary font-medium mb-2 line-clamp-1">
                          {doctor.profile_data.degrees.join(", ")}
                        </p>
                      )}
                      
                      <p className="text-sm font-semibold text-primary mb-3">{doctor.specialty}</p>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 grow">
                        {doctor.bio || "Experienced healthcare professional"}
                      </p>
                      
                      {/* Contact Info */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-border">
                        {doctor.phone && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone size={14} className="flex-shrink-0" />
                            <span className="truncate">{doctor.phone}</span>
                          </div>
                        )}
                        {doctor.email && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail size={14} className="flex-shrink-0" />
                            <span className="truncate">{doctor.email}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Button */}
                      <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
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
