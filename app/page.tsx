"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Heart, Users, Award, Clock, Star } from "lucide-react"
import { AppointmentModal } from "@/components/appointment-modal"
import { getDepartments, getDoctors, getBloodBanks, getAmbulanceServices, getEyeProducts } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Department {
  id: number
  name: string
  description: string
  image_url?: string
}

interface Doctor {
  id: number
  user: {
    full_name: string
  }
  specialty: string
  profile_image_url?: string
  years_of_experience?: number
}

export default function HomePage() {
  const { user, userType, isLoading: authLoading } = useAuth()
  const [departments, setDepartments] = useState<Department[]>([])
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([])
  const [bloodBanks, setBloodBanks] = useState<any[]>([])
  const [ambulanceServices, setAmbulanceServices] = useState<any[]>([])
  const [eyeProducts, setEyeProducts] = useState<any[]>([])
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const deptScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, doctorData] = await Promise.all([getDepartments(), getDoctors()])

        setDepartments(deptData || [])
        // Filter out doctors with invalid data structure
        const validDoctors = (doctorData || []).filter(
          (doc) => doc && doc.user && doc.user.full_name
        )
        setTopDoctors(validDoctors.slice(0, 3))
      } catch (error) {
        console.error("Error fetching data:", error)
        setDepartments([])
        setTopDoctors([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!isAutoScrolling || !deptScrollRef.current) return

    const interval = setInterval(() => {
      if (deptScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = deptScrollRef.current
        const newScrollLeft = scrollLeft + clientWidth

        if (newScrollLeft >= scrollWidth - clientWidth) {
          deptScrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          deptScrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
        }
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoScrolling])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const blogs = [
    {
      id: 1,
      title: "Understanding Heart Disease Prevention",
      excerpt: "Learn key strategies to prevent heart disease and maintain a healthy cardiovascular system.",
      category: "Cardiology",
      image: "/heart-health-prevention.jpg",
      date: "2025-01-28",
    },
    {
      id: 2,
      title: "Tips for Managing Chronic Pain",
      excerpt: "Discover effective techniques and treatments for managing chronic pain conditions.",
      category: "Pain Management",
      image: "/pain-management-techniques.jpg",
      date: "2025-01-25",
    },
    {
      id: 3,
      title: "Mental Health Awareness in 2025",
      excerpt: "A comprehensive guide to mental health awareness and maintaining emotional wellness.",
      category: "Mental Health",
      image: "/mental-health-wellness.png",
      date: "2025-01-22",
    },
    {
      id: 4,
      title: "Nutrition for Better Health",
      excerpt: "Explore balanced diet plans and nutritional guidance for optimal health outcomes.",
      category: "Nutrition",
      image: "/healthy-nutrition-diet.jpg",
      date: "2025-01-20",
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      role: "Patient",
      content:
        "The care I received at HealthCare Hospital was exceptional. The doctors were professional and attentive to my needs.",
      avatar: "/patient-testimonial.jpg",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Patient",
      content:
        "Outstanding medical facility with the latest equipment. I felt confident in the expertise of the healthcare team.",
      avatar: "/happy-patient.jpg",
      rating: 5,
    },
    {
      id: 3,
      name: "Michael Johnson",
      role: "Patient",
      content:
        "The entire staff was welcoming and supportive throughout my treatment. Highly recommended for anyone seeking quality healthcare.",
      avatar: "/satisfied-patient.jpg",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        className="container mx-auto w-full min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center"
        style={{
          backgroundImage: 'url("/bg_img.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome to <span className="text-primary">HealthCare Hospital</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Providing exceptional medical care with state-of-the-art facilities and experienced healthcare
              professionals dedicated to your wellness.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/appointment">Book an Appointment</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {[
              { icon: Heart, label: "Patients Served", value: "10,000+" },
              { icon: Users, label: "Expert Doctors", value: "150+" },
              { icon: Award, label: "Years Experience", value: "25+" },
              { icon: Clock, label: "Available 24/7", value: "Always" },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants} whileHover={{ translateY: -5 }} className="text-center">
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="text-sm md:text-base text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Auto-Scrolling Departments */}
      <section className="w-full py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Departments</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive medical services across multiple specialties
            </p>
          </motion.div>

          <div
            ref={deptScrollRef}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
            className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {departments.map((dept) => (
              <motion.div
                key={dept.id}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-lg flex-shrink-0 w-full md:w-96"
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <Image
                      src={dept.image_url || "/placeholder.svg"}
                      alt={dept.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-foreground mb-2">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{dept.description}</p>
                    <Link
                      href={`/departments?dept=${dept.id}`}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Learn More →
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/departments">View All Departments</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Top Doctors - Clickable Cards */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Doctors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experienced healthcare professionals committed to your care
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {topDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Link href={`/doctors/${doctor.id}`}>
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <Image
                        src={doctor.profile_image_url || "/placeholder.svg"}
                        alt={doctor.user.full_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-foreground mb-1">{doctor.user.full_name}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{doctor.specialty}</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {doctor.years_of_experience || 0}+ years of experience
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowAppointmentModal(true)
                        }}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/doctors">View All Doctors</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 px-4 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule an appointment with our expert doctors today and receive personalized medical care.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setShowAppointmentModal(true)}
            >
              Schedule Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Patient Services Section - Only for logged-in patients */}
      {!authLoading && user && userType === "patient" && (
        <section className="w-full py-20 px-4 bg-gradient-to-b from-blue-50 to-transparent">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Quick Access Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Emergency services and health products available for you
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Blood Banks Card */}
              <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Link href="/blood-banks">
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-red-50/50 cursor-pointer">
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <div className="text-3xl">🩸</div>
                      </div>
                      <h3 className="font-bold text-xl text-foreground mb-2">Blood Banks</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Find blood banks near you and check blood availability
                      </p>
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                        Find Blood Banks
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>

              {/* Ambulance Services Card */}
              <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Link href="/ambulance-services">
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-orange-50/50 cursor-pointer">
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <div className="text-3xl">🚑</div>
                      </div>
                      <h3 className="font-bold text-xl text-foreground mb-2">Ambulance Services</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Emergency ambulance services available 24/7
                      </p>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        Call Ambulance
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>

              {/* Eye Products Card */}
              <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Link href="/eye-products">
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-blue-50/50 cursor-pointer">
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <div className="text-3xl">👓</div>
                      </div>
                      <h3 className="font-bold text-xl text-foreground mb-2">Eye Products</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Premium eyewear and eye care products
                      </p>
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        Shop Now
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="w-full py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Health & Wellness Blog</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Latest articles on health, wellness, and medical insights
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <Image
                      src={blog.image || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        {blog.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{blog.date}</span>
                    </div>
                    <h3 className="font-bold text-base text-foreground mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{blog.excerpt}</p>
                    <Link href="#" className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                      Read More →
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full py-20 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Patient Testimonials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our satisfied patients about their experiences
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col p-6">
                  <div className="flex items-start gap-1 mb-4">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                      ))}
                  </div>

                  <p className="text-foreground mb-6 flex-1 italic">"{testimonial.content}"</p>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AppointmentModal isOpen={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} />

      <Footer />
    </div>
  )
}
