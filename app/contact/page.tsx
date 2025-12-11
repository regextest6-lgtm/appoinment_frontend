"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin } from "lucide-react"
import { createContactMessage } from "@/lib/api"

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      await createContactMessage(data)
      setSubmitMessage("Message sent successfully! We will get back to you soon.")
      reset()
      setTimeout(() => setSubmitMessage(""), 5000)
    } catch (error) {
      setSubmitMessage("Error sending message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Get In Touch
          </motion.h1>
          <p className="text-lg text-muted-foreground">We're here to help and answer any questions</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-5xl mx-auto py-20 px-4 flex-1">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Contact Info Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              className="lg:col-span-1 space-y-6"
            >
              {[
                { icon: Phone, label: "Hot Line", value: "(+880)1312-666677)\n(+880)1312-666688)\n(+880)1312-666699)" },
                { icon: Mail, label: "Email", value: "nazmulmodernhospital@gmail.com" },
                { icon: MapPin, label: "Address", value: "Moni Mukta Jhumka Complex Comilla, Daudkandi Bridge Toll Plaza, Daudkandi" },
              ].map((contact, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <contact.icon className="w-6 h-6 flex-shrink-0 mt-1 text-red-600" />
                  <div>
                    <h3 className="font-bold mb-1 text-red-600">{contact.label}</h3>
                    <p className="text-sm whitespace-pre-line text-primary font-semibold">{contact.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-sm ${
                      submitMessage.includes("successfully")
                        ? "bg-green-100/20 text-green-700 border border-green-200"
                        : "bg-red-100/20 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitMessage}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Your name"
                      className="bg-background border-border"
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                      })}
                      type="email"
                      placeholder="your@email.com"
                      className="bg-background border-border"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <Input {...register("phone")} placeholder="(555) 123-4567" className="bg-background border-border" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <Input
                    {...register("subject", { required: "Subject is required" })}
                    placeholder="What is this about?"
                    className="bg-background border-border"
                  />
                  {errors.subject && <span className="text-red-500 text-xs mt-1">{errors.subject.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <Textarea
                    {...register("message", { required: "Message is required" })}
                    placeholder="Tell us more..."
                    rows={6}
                    className="bg-background border-border resize-none"
                  />
                  {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
