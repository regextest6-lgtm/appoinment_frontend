import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { handleCORS, withCORS } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request)
}

export async function GET(request: NextRequest) {
  try {
    const corsCheckResponse = handleCORS(request)
    if (corsCheckResponse) return corsCheckResponse

    const results = await query("SELECT * FROM appointments ORDER BY createdAt DESC")
    const response = NextResponse.json(results, { status: 200 })
    return withCORS(response)
  } catch (error) {
    console.error("[v0] Appointments GET error:", error)
    const response = NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
    return withCORS(response)
  }
}

export async function POST(request: NextRequest) {
  try {
    const corsCheckResponse = handleCORS(request)
    if (corsCheckResponse) return corsCheckResponse

    const body = await request.json()

    // Validate required fields
    if (!body.patientName || !body.patientEmail || !body.appointmentDate) {
      const response = NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      return withCORS(response)
    }

    const sql = `
      INSERT INTO appointments 
      (patientName, patientEmail, patientPhone, department, doctorName, appointmentDate, appointmentTime, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `

    const values = [
      body.patientName,
      body.patientEmail,
      body.patientPhone || null,
      body.department || null,
      body.doctorName || null,
      body.appointmentDate,
      body.appointmentTime || null,
      body.notes || null,
    ]

    await query(sql, values)

    const response = NextResponse.json({ success: true, message: "Appointment booked successfully" }, { status: 201 })
    return withCORS(response)
  } catch (error) {
    console.error("[v0] Appointments POST error:", error)
    const response = NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
    return withCORS(response)
  }
}
