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
    qualifications: ["MD - Stanford University", "Board Certified Orthopedic Surgeon", "Specialization in Joint Replacement"],
    availability: "Tuesday - Saturday, 10AM - 6PM",
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
    qualifications: ["MD - Johns Hopkins", "Board Certified Neurologist", "Specialization in Migraine Management"],
    availability: "Monday - Thursday, 8AM - 4PM",
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
    qualifications: ["MD - Yale School of Medicine", "Board Certified Pediatrician", "Specialization in Pediatric Care"],
    availability: "Monday - Friday, 9AM - 5PM",
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
    qualifications: ["DDS - University of Pennsylvania", "Board Certified Dentist", "Specialization in Orthodontics"],
    availability: "Tuesday - Saturday, 10AM - 6PM",
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
