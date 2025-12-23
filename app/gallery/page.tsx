'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const galleryImages = [
  {
    id: 1,
    src: '/hospital-building.jpg',
    title: 'Hospital Building',
    category: 'facilities',
  },
  {
    id: 2,
    src: '/cardiology-clinic.jpg',
    title: 'Cardiology Clinic',
    category: 'departments',
  },
  {
    id: 3,
    src: '/dentistry-clinic.jpg',
    title: 'Dentistry Clinic',
    category: 'departments',
  },
  {
    id: 4,
    src: '/doctor-female.jpg',
    title: 'Our Medical Team',
    category: 'team',
  },
  {
    id: 5,
    src: '/doctor-male.jpg',
    title: 'Expert Doctors',
    category: 'team',
  },
  {
    id: 6,
    src: '/female-doctor.jpg',
    title: 'Healthcare Professionals',
    category: 'team',
  },
  {
    id: 7,
    src: '/happy-patient.jpg',
    title: 'Satisfied Patients',
    category: 'patients',
  },
  {
    id: 8,
    src: '/patient-testimonial.jpg',
    title: 'Patient Care',
    category: 'patients',
  },
  {
    id: 9,
    src: '/satisfied-patient.jpg',
    title: 'Quality Care',
    category: 'patients',
  },
  {
    id: 10,
    src: '/neurology-clinic.jpg',
    title: 'Neurology Department',
    category: 'departments',
  },
  {
    id: 11,
    src: '/orthopedics-clinic.jpg',
    title: 'Orthopedics Clinic',
    category: 'departments',
  },
  {
    id: 12,
    src: '/pediatrics-clinic.jpg',
    title: 'Pediatrics Department',
    category: 'departments',
  },
  {
    id: 13,
    src: '/healthy-nutrition-diet.jpg',
    title: 'Nutrition & Wellness',
    category: 'wellness',
  },
  {
    id: 14,
    src: '/heart-health-prevention.jpg',
    title: 'Heart Health',
    category: 'wellness',
  },
  {
    id: 15,
    src: '/mental-health-wellness.png',
    title: 'Mental Health',
    category: 'wellness',
  },
  {
    id: 16,
    src: '/pain-management-techniques.jpg',
    title: 'Pain Management',
    category: 'services',
  },
];

const categories = ['all', 'facilities', 'departments', 'team', 'patients', 'wellness', 'services'];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredImages =
    selectedCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedImage(null), 200);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage);
    let newIndex: number;

    if (direction === 'next') {
      newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    }

    setSelectedImage(filteredImages[newIndex].id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

    return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="w-full py-20 px-4 bg-linear-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Our Gallery
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our state-of-the-art facilities, expert medical team, and the exceptional care
              we provide
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="w-full py-8 px-4 bg-background sticky top-0 z-40 border-b shadow-sm">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="w-full py-12 px-4 flex-1">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(image.id)}
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={image.src}
                        alt={image.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                        <p className="text-white/80 text-sm capitalize">{image.category}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No images found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AnimatePresence>
          {isOpen && selectedImage !== null && (
            <DialogContent
              className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-0"
              showCloseButton={false}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Previous Button */}
                {filteredImages.length > 1 && (
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Next Button */}
                {filteredImages.length > 1 && (
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Image */}
                <AnimatePresence mode="wait">
                  {selectedImage && (
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full h-full flex items-center justify-center p-8"
                    >
                      {(() => {
                        const currentImage = filteredImages.find((img) => img.id === selectedImage);
                        if (!currentImage) return null;
                        return (
                          <>
                            <div className="relative w-full h-full max-w-6xl">
                              <Image
                                src={currentImage.src}
                                alt={currentImage.title}
                                fill
                                className="object-contain"
                                priority
                              />
                            </div>
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                              <h3 className="text-white text-2xl font-bold mb-2">
                                {currentImage.title}
                              </h3>
                              <p className="text-white/70 capitalize">{currentImage.category}</p>
                              <p className="text-white/50 text-sm mt-2">
                                {filteredImages.findIndex((img) => img.id === selectedImage) + 1} of{' '}
                                {filteredImages.length}
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      <Footer />
        </div>
    );
};

export default GalleryPage;