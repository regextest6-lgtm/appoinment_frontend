"use client"

import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  const values = [
    { title: "Excellence", desc: "Providing the highest quality healthcare" },
    { title: "Compassion", desc: "Caring for patients with empathy" },
    { title: "Innovation", desc: "Using latest medical technology" },
    { title: "Integrity", desc: "Operating with honesty and transparency" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About HealthCare Hospital</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dedicated to providing exceptional medical care since 1998
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="md:order-1">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                HealthCare Hospital was founded with a mission to provide accessible, high-quality medical care to our
                community. Over 25 years, we've grown to become one of the region's leading medical institutions.
              </p>
              <p className="text-muted-foreground mb-4">
                Our state-of-the-art facilities, combined with our team of dedicated healthcare professionals, enable us
                to deliver comprehensive medical services across multiple specialties.
              </p>
              <p className="text-muted-foreground">
                We are committed to advancing medical practice through continuous research, training, and adoption of
                innovative healthcare technologies.
              </p>
            </div>

            <div className="md:order-2 relative h-96">
              <Image src="/hospital-building.jpg" alt="Hospital" fill className="object-cover rounded-lg" />
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {values.map((value, idx) => (
                <div key={idx} className="hover:-translate-y-1 transition-transform">
                  <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                    <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-bold text-lg text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
