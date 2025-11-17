import { NextResponse } from "next/server"

const servicesData = [
  {
    id: 1,
    name: "Emergency Care",
    description: "24/7 emergency medical services with rapid response team",
    icon: "AlertCircle",
  },
  {
    id: 2,
    name: "Surgical Services",
    description: "Advanced surgical procedures with experienced surgeons",
    icon: "Scalpel",
  },
  {
    id: 3,
    name: "Diagnostic Imaging",
    description: "State-of-the-art imaging technology including MRI and CT scans",
    icon: "Activity",
  },
  {
    id: 4,
    name: "Laboratory Services",
    description: "Comprehensive lab testing and analysis services",
    icon: "Beaker",
  },
  {
    id: 5,
    name: "Rehabilitation",
    description: "Physical therapy and rehabilitation programs",
    icon: "Dumbbell",
  },
  {
    id: 6,
    name: "Pharmacy",
    description: "Full-service pharmacy with prescription and OTC medications",
    icon: "Pill",
  },
]

export async function GET() {
  try {
    return NextResponse.json(servicesData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
