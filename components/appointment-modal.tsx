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
  name: string
  specialty: string
  department_id: number
  image_url?: string
  experience_years?: number
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

        setDepartments(Array.isArray(deptData) ? deptData : [])
        // Filter out doctors with invalid data structure
        const validDoctors = (Array.isArray(doctorData) ? doctorData : []).filter(
          (doc: any) => doc && doc.name && doc.specialty
        )
        console.log("All doctors fetched:", validDoctors)
        console.log("Sample doctor:", validDoctors[0])
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
          <h2 className="text-2xl font-bold text-foreground mb-6">অ্যাপয়েন্টমেন্ট বুক করুন</h2>

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
              <label className="block text-sm font-medium text-foreground mb-1">আপনার নাম</label>
              <Input
                {...register("patientName", { required: "নাম প্রয়োজন" })}
                placeholder="Enter Your Name"
                className="bg-background border-border"
              />
              {errors.patientName && <span className="text-red-500 text-xs mt-1">{errors.patientName.message}</span>}
            </div>

            {/* Patient Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Mail size={16} /> ইমেইল
              </label>
              <Input
                {...register("patientEmail", {
                  required: "ইমেইল প্রয়োজন",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "অবৈধ ইমেইল ফরম্যাট",
                  },
                })}
                placeholder="email@example.com"
                type="email"
                className="bg-background border-border"
              />
              {errors.patientEmail && <span className="text-red-500 text-xs mt-1">{errors.patientEmail.message}</span>}
            </div>

            {/* Patient Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">ফোন নম্বর</label>
              <Input
                {...register("patientPhone", { required: "ফোন নম্বর প্রয়োজন" })}
                placeholder="01700000000"
                className="bg-background border-border"
              />
              {errors.patientPhone && <span className="text-red-500 text-xs mt-1">{errors.patientPhone.message}</span>}
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">বিভাগ</label>
              <select
                {...register("departmentId", { required: "একটি বিভাগ নির্বাচন করুন" })}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm transition-colors hover:border-primary"
              >
                <option value="">একটি বিভাগ নির্বাচন করুন...</option>
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
              <label className="block text-sm font-medium text-foreground mb-1">ডাক্তার ({filteredDoctors.length})</label>
              <select
                {...register("doctorId", { required: "একজন ডাক্তার নির্বাচন করুন" })}
                disabled={!selectedDepartmentId}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm disabled:opacity-50 transition-colors hover:border-primary"
              >
                <option value="">{selectedDepartmentId ? `একজন ডাক্তার নির্বাচন করুন... (${filteredDoctors.length} উপলব্ধ)` : "প্রথমে বিভাগ নির্বাচন করুন"}</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialty}
                  </option>
                ))}
              </select>
              {errors.doctorId && <span className="text-red-500 text-xs mt-1">{errors.doctorId.message}</span>}
              {selectedDepartmentId && filteredDoctors.length === 0 && (
                <p className="text-yellow-600 text-xs mt-1">এই বিভাগের জন্য কোনো ডাক্তার পাওয়া যায়নি।</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Calendar size={16} /> তারিখ
              </label>
              <Input
                {...register("appointmentDate", { required: "তারিখ প্রয়োজন" })}
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
                <Clock size={16} /> সময়
              </label>
              <Input
                {...register("appointmentTime", { required: "সময় প্রয়োজন" })}
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
                <FileText size={16} /> অতিরিক্ত নোট (ঐচ্ছিক)
              </label>
              <textarea
                {...register("notes")}
                placeholder="কোনো নির্দিষ্ট উদ্বেগ বা চিকিৎসা ইতিহাস উল্লেখ করুন..."
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
              {isSubmitting ? "বুকিং হচ্ছে..." : "অ্যাপয়েন্টমেন্ট নিশ্চিত করুন"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
