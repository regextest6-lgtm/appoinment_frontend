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

    const {
      patientName,
      patientEmail,
      patientPhone,
      department,
      departmentId,
      doctorId,
      doctorName,
      appointmentDate,
      appointmentTime,
      notes,
    } = body

    // Validate required fields
    if (
      !patientName ||
      !patientEmail ||
      !patientPhone ||
      !(department ?? departmentId) ||
      !appointmentDate ||
      !appointmentTime
    ) {
      const response = NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      return withCORS(response)
    }

    const resolvedDepartment =
      department ||
      (typeof departmentId === "number" && !Number.isNaN(departmentId) ? String(departmentId) : null)

    if (!resolvedDepartment) {
      const response = NextResponse.json({ error: "Department is required" }, { status: 400 })
      return withCORS(response)
    }

    const sql = `
      INSERT INTO appointments 
      (patientName, patientEmail, patientPhone, department, doctorId, doctorName, appointmentDate, appointmentTime, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `

    const values = [
      patientName,
      patientEmail,
      patientPhone,
      resolvedDepartment,
      doctorId ?? null,
      doctorName || null,
      appointmentDate,
      appointmentTime,
      notes || null,
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
