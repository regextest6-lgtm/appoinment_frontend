import { NextResponse } from "next/server"

const servicesData = [
  {
    id: 1,
    name: "General Checkup",
    description: "Comprehensive health assessment",
    category: "General",
    price: 100,
    duration: 30,
  },
  { id: 2, name: "Blood Test", description: "Complete blood work analysis", category: "Lab", price: 50, duration: 15 },
  { id: 3, name: "X-Ray", description: "Digital X-ray imaging", category: "Imaging", price: 150, duration: 20 },
  {
    id: 4,
    name: "Consultation",
    description: "Doctor consultation and diagnosis",
    category: "Consultation",
    price: 75,
    duration: 20,
  },
  {
    id: 5,
    name: "Dental Cleaning",
    description: "Professional teeth cleaning and examination",
    category: "Dental",
    price: 120,
    duration: 45,
  },
  { id: 6, name: "ECG", description: "Electrocardiogram test", category: "Cardiac", price: 200, duration: 15 },
  {
    id: 7,
    name: "Ultrasound",
    description: "Ultrasound imaging examination",
    category: "Imaging",
    price: 180,
    duration: 30,
  },
]

export async function GET() {
  try {
    return NextResponse.json(servicesData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
