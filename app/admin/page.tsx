"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { motion } from "framer-motion"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboard() {
  const {
    data: appointments,
    isLoading: apptLoading,
    error: apptError,
    mutate: mutateAppts,
  } = useSWR("/api/appointments", fetcher, { refreshInterval: 5000 })

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      mutateAppts()
      setSelectedAppointment(null)
    } catch (error) {
      console.error("Failed to update status:", error)
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage appointments and customer inquiries</p>
      </motion.div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages</TabsTrigger>
        </TabsList>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4">
            {apptLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">Loading appointments...</p>
                </CardContent>
              </Card>
            ) : apptError ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-red-500">Failed to load appointments</p>
                </CardContent>
              </Card>
            ) : !appointments || appointments.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No appointments yet</p>
                </CardContent>
              </Card>
            ) : (
              appointments.map((appointment: any) => (
                <motion.div key={appointment.id} variants={itemVariants}>
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                          <CardDescription>{appointment.patientEmail}</CardDescription>
                        </div>
                        <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{appointment.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Doctor</p>
                        <p className="font-medium">{appointment.doctorName || "Not assigned"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{appointment.appointmentDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{appointment.appointmentTime || "N/A"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Appointment Details Modal */}
          {selectedAppointment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedAppointment(null)}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              >
                <h2 className="text-2xl font-bold mb-4">{selectedAppointment.patientName}</h2>
                <div className="space-y-3 mb-6">
                  <p>
                    <span className="font-medium">Email:</span> {selectedAppointment.patientEmail}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {selectedAppointment.patientPhone}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span> {selectedAppointment.department}
                  </p>
                  <p>
                    <span className="font-medium">Doctor:</span> {selectedAppointment.doctorName || "Not assigned"}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {selectedAppointment.appointmentDate}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {selectedAppointment.appointmentTime}
                  </p>
                  {selectedAppointment.notes && (
                    <p>
                      <span className="font-medium">Notes:</span> {selectedAppointment.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedAppointment.status !== "confirmed" && (
                    <Button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "confirmed")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Confirm
                    </Button>
                  )}
                  {selectedAppointment.status !== "cancelled" && (
                    <Button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "cancelled")}
                      variant="destructive"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button onClick={() => setSelectedAppointment(null)} variant="outline">
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Contact messages feature coming soon</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
