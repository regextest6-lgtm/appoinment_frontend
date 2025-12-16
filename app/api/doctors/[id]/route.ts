import { NextResponse } from "next/server"

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
    qualifications: ["MD - Harvard Medical School", "Board Certified Cardiologist", "Fellowship in Interventional Cardiology"],
    availability: "Monday - Friday, 9AM - 5PM",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const doctor = doctorsData.find((d) => d.id === id)

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json(doctor, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctor" }, { status: 500 })
  }
}
