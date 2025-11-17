"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Calendar, Clock, Mail, FileText } from "lucide-react"
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

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AppointmentFormData>({
    defaultValues: {
      departmentId: "",
      doctorId: "",
      patientName: "",
      patientEmail: "",
      patientPhone: "",
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

        setDepartments(deptData || [])
        // Filter out doctors with invalid data structure
        const validDoctors = (doctorData || []).filter(
          (doc) => doc && doc.user && doc.user.full_name
        )
        setAllDoctors(validDoctors)
      } catch (error) {
        console.error("Error fetching data:", error)
        setDepartments([])
        setAllDoctors([])
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

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
      setTimeout(() => {
        setSubmitMessage("")
        onClose()
      }, 2000)
    } catch (error) {
      setSubmitMessage("Error booking appointment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
        <div onClick={onClose} className="absolute inset-0 bg-black/50 transition-opacity duration-200" />
        <div className="relative bg-background rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors z-10"
          >
            <X size={20} />
          </button>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
        <div onClick={onClose} className="absolute inset-0 bg-black/50 transition-opacity duration-200" />
        <div className="relative bg-background rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors z-10"
          >
            <X size={20} />
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 mx-auto">
              <Calendar size={24} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to book an appointment. Please log in or create an account to continue.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  onClose()
                  router.push("/auth/login")
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Go to Login
              </Button>
              <Button
                onClick={() => {
                  onClose()
                  router.push("/auth/register")
                }}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/50 transition-opacity duration-200" />

      {/* Modal Content */}
      <div className="relative bg-background rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Modal Body */}
        <div className="p-8 pt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Book Appointment</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitMessage && (
              <div
                className={`p-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
                  submitMessage.includes("successfully")
                    ? "bg-green-100/20 text-green-700 border border-green-200"
                    : "bg-red-100/20 text-red-700 border border-red-200"
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Your Name</label>
              <Input
                {...register("patientName", { required: "Name is required" })}
                placeholder="John Doe"
                className="bg-background border-border"
              />
              {errors.patientName && <span className="text-red-500 text-xs mt-1">{errors.patientName.message}</span>}
            </div>

            {/* Patient Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
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
              {errors.patientEmail && <span className="text-red-500 text-xs mt-1">{errors.patientEmail.message}</span>}
            </div>

            {/* Patient Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
              <Input
                {...register("patientPhone", { required: "Phone is required" })}
                placeholder="(555) 123-4567"
                className="bg-background border-border"
              />
              {errors.patientPhone && <span className="text-red-500 text-xs mt-1">{errors.patientPhone.message}</span>}
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Department</label>
              <select
                {...register("departmentId", { required: "Please select a department" })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm transition-colors hover:border-primary"
              >
                <option value="">Select a department...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && <span className="text-red-500 text-xs mt-1">{errors.departmentId.message}</span>}
            </div>

            {/* Doctor Selection - Filtered by Department */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Doctor</label>
              <select
                {...register("doctorId", { required: "Please select a doctor" })}
                disabled={!selectedDepartmentId}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm disabled:opacity-50 transition-colors hover:border-primary"
              >
                <option value="">{selectedDepartmentId ? "Select a doctor..." : "Select department first"}</option>
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
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
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
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
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
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <FileText size={16} /> Additional Notes (Optional)
              </label>
              <textarea
                {...register("notes")}
                placeholder="Any specific concerns or medical history to mention..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm transition-colors hover:border-primary"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 font-medium mt-6 transition-all duration-200"
            >
              {isSubmitting ? "Booking..." : "Confirm Appointment"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
