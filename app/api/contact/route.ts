import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { handleCORS, withCORS } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request)
}

export async function POST(request: NextRequest) {
  try {
    const corsCheckResponse = handleCORS(request)
    if (corsCheckResponse) return corsCheckResponse

    const body = await request.json()

    if (!body.name || !body.email || !body.message) {
      const response = NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      return withCORS(response)
    }

    const sql = `
      INSERT INTO contact_messages (name, email, phone, message, status)
      VALUES (?, ?, ?, ?, 'new')
    `

    const values = [body.name, body.email, body.phone || null, body.message]

    await query(sql, values)

    const response = NextResponse.json({ success: true, message: "Message received successfully" }, { status: 201 })
    return withCORS(response)
  } catch (error) {
    console.error("[v0] Contact POST error:", error)
    const response = NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    return withCORS(response)
  }
}
