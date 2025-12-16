import { NextResponse } from "next/server"

// In-memory data storage (for demo - would use database in production)
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    imageUrl: "/female-doctor.jpg",
    bio: "Expert in cardiac care with 15+ years of experience",
    experienceYears: 15,
    phone: "555-0101",
    email: "sarah.johnson@hospital.com",
    departmentId: 1,
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("departmentId")

    let filtered = doctorsData
    if (departmentId) {
      filtered = doctorsData.filter((d) => d.departmentId === Number.parseInt(departmentId))
    }

    return NextResponse.json(filtered, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}
