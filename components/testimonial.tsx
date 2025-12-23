"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
  ];

  const handleNextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];
  const nextTestimonialData = testimonials[(currentIndex + 1) % testimonials.length];

  return (
    <section className="w-full bg-[#E8F7F4] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE */}
        <div>
          <span className="text-teal-600 font-semibold tracking-wide flex items-center gap-3">
            <span className="w-10 h-[2px] bg-teal-400"></span>
            TESTIMONIALS
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-3">
            Great Patient Stories
          </h2>

          <p className="text-gray-600 mt-6 max-w-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, 
            dictum est a, mattis tellus. Sed dignissim metus nec fringilla accumsan.
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-10">
            <button 
              onClick={handlePrevTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:scale-110 transition-transform duration-200 active:scale-95"
            >
              <span className="text-2xl">‹</span>
            </button>

            <button 
              onClick={handleNextTestimonial}
              className="w-12 h-12 rounded-full bg-teal-500 text-white shadow-lg flex items-center justify-center hover:bg-teal-600 hover:scale-110 transition-transform duration-200 active:scale-95"
            >
              <span className="text-2xl">›</span>
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - 3D Perspective Container */}
        <div className="relative perspective-1000 min-h-[400px]">
          {/* Back (small) faded card - 3D positioned */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`back-${currentIndex}`}
              initial={{ opacity: 0, x: 50, rotateY: 25, scale: 0.8, z: -100 }}
              animate={{ 
                opacity: 0.6, 
                x: 40, 
                rotateY: 20, 
                scale: 0.85, 
                z: -80
              }}
              exit={{ opacity: 0, x: 50, rotateY: 25, scale: 0.8, z: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute -right-10 top-10 w-[320px] bg-white shadow-lg rounded-xl p-6"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <p className="text-gray-500 text-sm leading-relaxed">
                {nextTestimonialData.content.substring(0, 100)}...
              </p>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src={nextTestimonialData.avatar}
                    alt={nextTestimonialData.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{nextTestimonialData.name}</p>
                  <p className="text-gray-500 text-sm">{nextTestimonialData.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Main card - 3D positioned */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`main-${currentIndex}`}
              initial={{ 
                opacity: 0, 
                x: -100, 
                rotateY: -35, 
                scale: 0.9, 
                z: -50
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                rotateY: 0, 
                scale: 1, 
                z: 0
              }}
              exit={{ 
                opacity: 0, 
                x: 100, 
                rotateY: 35, 
                scale: 0.9, 
                z: -50
              }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              className="relative bg-white shadow-2xl rounded-xl p-10 w-full max-w-xl"
              style={{
                transformStyle: "preserve-3d",
              }}
              whileHover={{ 
                scale: 1.02,
                rotateY: 3,
                z: 10,
                transition: { duration: 0.3 }
              }}
            >
              <p className="text-gray-600 leading-relaxed">
                {currentTestimonial.content}
              </p>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                    <Image
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{currentTestimonial.name}</p>
                    <p className="text-gray-500 text-sm">{currentTestimonial.role}</p>
                  </div>
                </div>

                <span className="text-teal-300 text-6xl font-bold leading-none select-none">
                  ❝
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
