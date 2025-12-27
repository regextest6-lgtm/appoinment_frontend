"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getDepartments, DepartmentResponse } from "@/lib/api"
import { ChevronRight } from "lucide-react"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments()
        setDepartments(data)
      } catch (error) {
        console.error("Error fetching departments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

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
            Our Departments
          </motion.h1>
          <p className="text-lg text-muted-foreground">Comprehensive medical services across all specialties</p>
        </div>
      </section>

      {/* Departments Table */}
      <section className="w-full py-20 px-4 flex-1">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No departments found</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-x-auto rounded-lg border border-border shadow-lg"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-primary/5 border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, index) => (
                    <motion.tr
                      key={dept.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">{dept.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground text-sm line-clamp-2">{dept.description}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80 hover:bg-primary/10"
                        >
                          <Link href={`/doctors?dept=${dept.id}`} className="flex items-center gap-1">
                            View Doctors
                            <ChevronRight size={16} />
                          </Link>
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
