import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Healthcare API is running" }, { status: 200 })
}
