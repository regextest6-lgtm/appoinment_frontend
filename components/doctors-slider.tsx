'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image_url?: string;
  experience_years?: number;
}

interface DoctorsSliderProps {
  doctors: Doctor[];
  onBookAppointment: () => void;
}

export function DoctorsSlider({ doctors, onBookAppointment }: DoctorsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [autoPlay, setAutoPlay] = useState(true);

  // Determine items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || doctors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, doctors.length - itemsPerView + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, doctors.length, itemsPerView]);

  const handlePrev = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, doctors.length - itemsPerView + 1)) % Math.max(1, doctors.length - itemsPerView + 1));
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, doctors.length - itemsPerView + 1));
  };

  const visibleDoctors = doctors.slice(currentIndex, currentIndex + itemsPerView);

  if (doctors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No doctors available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Slider Container */}
      <div className="relative">
        {/* Slider Track */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{ x: -currentIndex * (100 / itemsPerView) + '%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / itemsPerView}% - ${(8 * (itemsPerView - 1)) / itemsPerView}px)` }}
                whileHover={{ y: -8 }}
              >
                <Link href={`/doctors/${doctor.id}`}>
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col group cursor-pointer">
                    <div className="relative w-full aspect-square overflow-hidden bg-muted shrink-0">
                      <Image
                        src={doctor.image_url || '/placeholder.svg'}
                        alt={doctor.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        priority={false}
                        className="object-cover object-top group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex flex-col grow">
                      <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-primary font-semibold mb-2">{doctor.specialty}</p>
                      <p className="text-xs text-muted-foreground mb-4 grow">
                        {doctor.experience_years || 0}+ years of experience
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          onBookAppointment();
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
        </div>

        {/* Navigation Buttons */}
        {doctors.length > itemsPerView && (
          <>
            <button
              onClick={handlePrev}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 z-10 bg-primary hover:bg-primary/90 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
              aria-label="Previous doctors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 z-10 bg-primary hover:bg-primary/90 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
              aria-label="Next doctors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {doctors.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.max(1, doctors.length - itemsPerView + 1) }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setAutoPlay(false);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Indicator */}
      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">
          {autoPlay ? '⏱️ Auto-playing' : '⏸️ Paused'}
        </p>
      </div>
    </div>
  );
}
