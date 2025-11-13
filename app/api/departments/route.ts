import { NextResponse } from "next/server"

const departmentsData = [
  {
    id: 1,
    name: "Cardiology",
    description: "Heart and cardiovascular disease treatment",
    imageUrl: "/cardiology-clinic.jpg",
  },
  {
    id: 2,
    name: "Orthopedics",
    description: "Bone, joint and muscle care",
    imageUrl: "/orthopedics-clinic.jpg",
  },
  {
    id: 3,
    name: "Neurology",
    description: "Nervous system and brain disorders",
    imageUrl: "/neurology-clinic.jpg",
  },
  {
    id: 4,
    name: "Pediatrics",
    description: "Healthcare for children and infants",
    imageUrl: "/pediatrics-clinic.jpg",
  },
  {
    id: 5,
    name: "Dentistry",
    description: "Dental and oral healthcare",
    imageUrl: "/dentistry-clinic.jpg",
  },
]

export async function GET() {
  try {
    return NextResponse.json(departmentsData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 })
  }
}
