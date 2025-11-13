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
  {
    id: 2,
    name: "Dr. James Chen",
    specialty: "Orthopedic Surgeon",
    imageUrl: "/male-doctor.jpg",
    bio: "Specialized in joint replacement surgery",
    experienceYears: 12,
    phone: "555-0102",
    email: "james.chen@hospital.com",
    departmentId: 2,
  },
  {
    id: 3,
    name: "Dr. Maria Garcia",
    specialty: "Neurologist",
    imageUrl: "/doctor-female.jpg",
    bio: "Expert in migraine and neurological disorders",
    experienceYears: 10,
    phone: "555-0103",
    email: "maria.garcia@hospital.com",
    departmentId: 3,
  },
  {
    id: 4,
    name: "Dr. Robert Williams",
    specialty: "Pediatrician",
    imageUrl: "/doctor-male.jpg",
    bio: "Compassionate care for children of all ages",
    experienceYears: 18,
    phone: "555-0104",
    email: "robert.williams@hospital.com",
    departmentId: 4,
  },
  {
    id: 5,
    name: "Dr. Emily Brown",
    specialty: "Dentist",
    imageUrl: "/dentist-visit.png",
    bio: "Comprehensive dental and orthodontic care",
    experienceYears: 8,
    phone: "555-0105",
    email: "emily.brown@hospital.com",
    departmentId: 5,
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
