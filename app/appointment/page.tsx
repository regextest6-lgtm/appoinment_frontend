"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Mail, FileText } from "lucide-react"
import { getDepartments, getDoctors, createAppointment } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Doctor {
  id: number
  user: {
    full_name: string
  }
  specialty: string
  department_id: number
}

interface Department {
  id: number
  name: string
}

interface AppointmentFormData {
  patientName: string
  patientEmail: string
  patientPhone: string
  departmentId: string
  doctorId: string
  appointmentDate: string
  appointmentTime: string
  notes: string
}

export default function AppointmentPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const doctorIdParam = searchParams.get("doctorId")
  const [departments, setDepartments] = useState<Department[]>([])
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  // Check authentication on mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AppointmentFormData>({
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      departmentId: "",
      doctorId: doctorIdParam || "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    },
  })

  const selectedDepartmentId = watch("departmentId")

  useEffect(() => {
    if (selectedDepartmentId) {
      const filtered = allDoctors.filter((doc) => doc.department_id === Number.parseInt(selectedDepartmentId))
      setFilteredDoctors(filtered)
    } else {
      setFilteredDoctors([])
    }
  }, [selectedDepartmentId, allDoctors])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, doctorData] = await Promise.all([getDepartments(), getDoctors()])

        setDepartments(Array.isArray(deptData) ? deptData : [])
        // Filter out doctors with invalid data structure
        const validDoctors = Array.isArray(doctorData)
          ? doctorData.filter(
              (d: Doctor) => d && d.user && d.user.full_name
            )
          : []
        setAllDoctors(validDoctors)
      } catch (error) {
        console.error("Error fetching data:", error)
        setDepartments([])
        setAllDoctors([])
      }
    }

    fetchData()
  }, [])

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true)
    try {
      const doctorId = Number.parseInt(data.doctorId)
      const departmentId = Number.parseInt(data.departmentId)

      await createAppointment({
        department_id: departmentId,
        doctor_id: doctorId || undefined,
        appointment_date: data.appointmentDate,
        appointment_time: data.appointmentTime,
        notes: data.notes,
      })

      setSubmitMessage("Appointment booked successfully! You will receive a confirmation call shortly.")
      reset()
      setTimeout(() => setSubmitMessage(""), 5000)
    } catch (error) {
      setSubmitMessage("Error booking appointment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <section className="w-full py-20 px-4 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // Redirect happens in useEffect, but show nothing while redirecting
  if (!isAuthenticated) {
    return null
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
            Book an Appointment
          </motion.h1>
          <p className="text-lg text-muted-foreground">Schedule your medical appointment with our expert doctors</p>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="w-full py-20 px-4 flex-1">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg shadow-lg p-8 border border-border"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg text-sm ${
                    submitMessage.includes("successfully")
                      ? "bg-green-100/20 text-green-700 border border-green-200"
                      : "bg-red-100/20 text-red-700 border border-red-200"
                  }`}
                >
                  {submitMessage}
                </motion.div>
              )}

              {/* Personal Information */}
              <div>
                <h3 className="font-bold text-lg text-foreground mb-4">Personal Information</h3>
                <div className="space-y-4">
                  {/* Patient Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                    <Input
                      {...register("patientName", { required: "Name is required" })}
                      placeholder="John Doe"
                      className="bg-background border-border"
                    />
                    {errors.patientName && (
                      <span className="text-red-500 text-xs mt-1">{errors.patientName.message}</span>
                    )}
                  </div>

                  {/* Patient Email */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </label>
                    <Input
                      {...register("patientEmail", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                      placeholder="john@example.com"
                      type="email"
                      className="bg-background border-border"
                    />
                    {errors.patientEmail && (
                      <span className="text-red-500 text-xs mt-1">{errors.patientEmail.message}</span>
                    )}
                  </div>

                  {/* Patient Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <Input
                      {...register("patientPhone", { required: "Phone is required" })}
                      placeholder="(555) 123-4567"
                      className="bg-background border-border"
                    />
                    {errors.patientPhone && (
                      <span className="text-red-500 text-xs mt-1">{errors.patientPhone.message}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-lg text-foreground mb-4">Appointment Details</h3>
                <div className="space-y-4">
                  {/* Department Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                    <select
                      {...register("departmentId", { required: "Please select a department" })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                    >
                      <option value="">Select a department...</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {errors.departmentId && (
                      <span className="text-red-500 text-xs mt-1">{errors.departmentId.message}</span>
                    )}
                  </div>

                  {/* Doctor Selection - Filtered by Department */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Doctor</label>
                    <select
                      {...register("doctorId", { required: "Please select a doctor" })}
                      disabled={!selectedDepartmentId}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm disabled:opacity-50"
                    >
                      <option value="">
                        {selectedDepartmentId ? "Select a doctor..." : "Select department first"}
                      </option>
                      {filteredDoctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.user.full_name}
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && <span className="text-red-500 text-xs mt-1">{errors.doctorId.message}</span>}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Calendar size={16} /> Date
                    </label>
                    <Input
                      {...register("appointmentDate", { required: "Date is required" })}
                      type="date"
                      className="bg-background border-border"
                    />
                    {errors.appointmentDate && (
                      <span className="text-red-500 text-xs mt-1">{errors.appointmentDate.message}</span>
                    )}
                  </div>

                  {/* Time */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Clock size={16} /> Time
                    </label>
                    <Input
                      {...register("appointmentTime", { required: "Time is required" })}
                      type="time"
                      className="bg-background border-border"
                    />
                    {errors.appointmentTime && (
                      <span className="text-red-500 text-xs mt-1">{errors.appointmentTime.message}</span>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <FileText size={16} /> Additional Notes (Optional)
                    </label>
                    <textarea
                      {...register("notes")}
                      placeholder="Any specific concerns or medical history to mention..."
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-medium"
              >
                {isSubmitting ? "Booking..." : "Confirm Appointment"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
