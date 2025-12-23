'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Heart, Users, Award, Clock, Star } from 'lucide-react';
import { AppointmentModal } from '@/components/appointment-modal';
import {
  getDepartments,
  getDoctors,
  getBloodBanks,
  getAmbulanceServices,
  getEyeProducts,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import TestimonialSection from '@/components/testimonial';
import Blogs from '@/components/blogs';
import FacilitiesSection from '@/components/services';

interface Department {
  id: number;
  name: string;
  description: string;
  image_url?: string;
}

interface Doctor {
  id: number;
  user: {
    full_name: string;
  };
  specialty: string;
  profile_image_url?: string;
  years_of_experience?: number;
}

export default function HomePage() {
  const { user, userType, isLoading: authLoading } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [ambulanceServices, setAmbulanceServices] = useState<any[]>([]);
  const [eyeProducts, setEyeProducts] = useState<any[]>([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const deptScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, doctorData] = await Promise.all([getDepartments(), getDoctors()]);

        setDepartments(Array.isArray(deptData) ? deptData : []);
        // Filter out doctors with invalid data structure
        const validDoctors = (Array.isArray(doctorData) ? doctorData : []).filter(
          (doc: any) => doc && doc.user && doc.user.full_name
        );
        setTopDoctors(validDoctors.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
        setDepartments([]);
        setTopDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isAutoScrolling || !deptScrollRef.current) return;

    const interval = setInterval(() => {
      if (deptScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = deptScrollRef.current;
        const newScrollLeft = scrollLeft + clientWidth;

        if (newScrollLeft >= scrollWidth - clientWidth) {
          deptScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          deptScrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  function Feature({ text }: { text: string }) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-teal-500 text-lg">✔</span>
        <p className="text-gray-700">{text}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section
        className="w-full min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: 'url("/bg_img.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container lg:text-left text-center flex items-center min-h-[450px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 max-w-xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to <br /> <span className="text-primary">Nazmul Modern Hospital</span>
            </h1>
            <p className="text-lg text-neutral-800 max-w-2xl mb-8">
              Providing exceptional medical care with state-of-the-art facilities and experienced
              healthcare professionals dedicated to your wellness.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link href="/auth/login">Book an Appointment</Link>
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
              { icon: Heart, label: 'Patients Served', value: '10,000+' },
              { icon: Users, label: 'Expert Doctors', value: '150+' },
              { icon: Award, label: 'Years Experience', value: '25+' },
              { icon: Clock, label: 'Emergency Ambulance', value: 'Always' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ translateY: -5 }}
                className="bg-white shadow-lg rounded-xl p-6 text-center"
              >
                <stat.icon className="w-12 h-12 text-primary mx-auto mb-3" />
                <p className="text-sm md:text-base text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full bg-[#F4FBFC] py-20 overflow-x-hidden">
        {/* Main About Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 items-center px-4 lg:px-0">
          {/* Left Content */}
          <div>
            <span className="text-primary font-semibold tracking-wide">ABOUT US</span>
            <h1 className="text-2xl md:text-3xl font-bold mt-3 leading-snug">
              Welcome To Nazmul <br /> Modern Hospital
            </h1>

            <p className="text-gray-600 mt-6 leading-relaxed">
              Nazmul Modern Hospital is a leading healthcare provider in Bangladesh, offering
              comprehensive medical services across multiple specialties. With a team of experienced
              doctors and state-of-the-art facilities, we are committed to delivering exceptional
              care to our patients.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <Feature text="15+ Years of excellence" />
              <Feature text="24/7 Hour Medical Service" />
              <Feature text="A Multispecialty hospital" />
              <Feature text="A team of professionals" />
            </div>

            <button className="mt-8 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg">
              <Link href="/appointment">Book An Appointment</Link>
            </button>
          </div>

          {/* Right Image */}
          <div className="relative w-full max-w-[500px] mx-auto overflow-visible">
            {/* Mint top-right box */}
            <div
              className="absolute -top-6 -right-6 w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-md hidden md:block"
              style={{ backgroundColor: '#7ED9D0' }}
            />

            {/* Blue bottom-left box */}
            <div
              className="absolute -bottom-6 -left-6 w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-md hidden md:block"
              style={{ backgroundColor: '#BACBEF' }}
            />

            {/* Main image */}
            <img
              src="https://images.unsplash.com/photo-1550831107-1553da8c8464"
              alt="Doctor"
              className="relative z-10 w-full max-w-[500px] h-auto aspect-square object-cover"
            />
          </div>
        </div>
      </section>

      {/* Auto-Scrolling Departments */}
      <section className="w-full py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Departments</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive medical services across multiple specialties
            </p>
          </motion.div>

          <div
            ref={deptScrollRef}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
            className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide scroll-smooth max-w-full"
          >
            {departments.map((dept) => (
              <motion.div
                key={dept.id}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-lg shrink-0 w-[280px] md:w-96"
              >
                <Card className="h-full overflow-hidden border-0 py-0 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <Image
                      src={dept.image_url || '/placeholder.svg'}
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline">
              <Link href="/departments">View All Departments</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Top Doctors - Clickable Cards */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet Our Doctors
            </h2>
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
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                    <div className="relative w-full aspect-square overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={doctor.profile_image_url || '/placeholder.svg'}
                        alt={doctor.user.full_name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        className="object-cover object-top group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                        {doctor.user.full_name}
                      </h3>
                      <p className="text-sm text-primary font-semibold mb-2">{doctor.specialty}</p>
                      <p className="text-xs text-muted-foreground mb-4 flex-grow">
                        {doctor.years_of_experience || 0}+ years of experience
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAppointmentModal(true);
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline">
              <Link href="/doctors">View All Doctors</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-16 px-4 bg-linear-to-r from-primary/20 to-accent/20">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-md text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule an appointment with our expert doctors today and receive personalized medical
              care.
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
      {!authLoading && user && userType === 'patient' && (
        <section className="w-full py-20 px-4 bg-linear-to-r from-blue-50 to-transparent">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quick Access Services
              </h2>
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

      {/* Services Section */}
      <FacilitiesSection />

      {/* Blog Section */}
      <Blogs />

      <TestimonialSection />

      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
      />

      <Footer />
    </div>
  );
}
