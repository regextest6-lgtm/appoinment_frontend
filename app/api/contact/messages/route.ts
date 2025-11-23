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

    const results = await query("SELECT * FROM contact_messages ORDER BY createdAt DESC")
    const response = NextResponse.json(results, { status: 200 })
    return withCORS(response)
  } catch (error) {
    console.error("[v0] Contact Messages GET error:", error)
    const response = NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    return withCORS(response)
  }
}
