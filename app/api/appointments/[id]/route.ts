import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { handleCORS, withCORS } from "@/lib/cors"

export async function OPTIONS(request: NextRequest) {
  return handleCORS(request)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const corsCheckResponse = handleCORS(request)
    if (corsCheckResponse) return corsCheckResponse

    const body = await request.json()
    const { id } = params

    const sql = "UPDATE appointments SET status = ? WHERE id = ?"
    await query(sql, [body.status, Number.parseInt(id)])

    const response = NextResponse.json({ success: true, message: "Appointment updated" }, { status: 200 })
    return withCORS(response)
  } catch (error) {
    console.error("[v0] PUT error:", error)
    const response = NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
    return withCORS(response)
  }
}
