'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Phone, Briefcase, Clock } from 'lucide-react';
import { getDoctorById, getDoctorsByDepartment } from '@/lib/api';

interface Doctor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  specialty: string;
  department_id: number;
  bio?: string;
  image_url?: string;
  experience_years?: number;
  is_available: boolean;
  is_active: boolean;
  profile_data?: {
    degrees?: string[];
    workplace?: string;
    visiting_schedule?: Array<{ day: string; time: string }>;
    treats?: string[];
  };
  created_at: string;
  updated_at: string;
}

interface DepartmentWiseDoctor {
  id: number;
  name: string;
  specialty: string;
  image_url?: string;
  experience_years?: number;
  department_id: number;
}

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [departmentDoctors, setDepartmentDoctors] = useState<DepartmentWiseDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching doctor with ID:', doctorId);
        const selectedDoctor = await getDoctorById(Number(doctorId)) as Doctor;
        console.log('Doctor data received:', selectedDoctor);

        if (selectedDoctor) {
          setDoctor(selectedDoctor);

          const deptId = selectedDoctor.department_id;
          if (deptId) {
            try {
              const deptDoctorsData = await getDoctorsByDepartment(deptId) as Doctor[];
              const filteredDoctors = (deptDoctorsData || []).filter((d: Doctor) => d.id !== selectedDoctor.id);
              setDepartmentDoctors(filteredDoctors);
            } catch (deptError) {
              console.warn('Error fetching department doctors:', deptError);
              // Continue even if department doctors fail to load
            }
          }
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        // Show error message to user
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchData();
    }
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading doctor details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Doctor not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="w-full py-16 px-4 bg-linear-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Link
              href="/doctors"
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              ← Back to Doctors
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Doctor Details */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {/* Doctor Image */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden border-0 shadow-lg h-full">
                <div className="relative h-96 overflow-hidden bg-muted">
                  <Image
                    src={doctor.image_url || '/placeholder.svg'}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            </div>

            {/* Doctor Info */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl font-bold text-foreground mb-2">{doctor.name}</h1>
                <p className="text-2xl text-primary font-medium mb-2">
                  {doctor.profile_data?.degrees?.join(", ") || ""}
                </p>
                <p className="text-xl text-muted-foreground font-medium mb-6">{doctor.specialty}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-lg">
                    <Briefcase size={24} className="text-primary" />
                    <span className="text-foreground">
                      {doctor.experience_years ?? 0}+ years of experience
                    </span>
                  </div>
                  {doctor.profile_data?.visiting_schedule && doctor.profile_data.visiting_schedule.length > 0 && (
                    <div className="flex items-center gap-3 text-lg">
                      <Clock size={20} className="text-primary" />
                      <span className="text-foreground">
                        {doctor.profile_data.visiting_schedule.map((s) => `${s.day} ${s.time}`).join(", ")}
                      </span>
                    </div>
                  )}
                  {doctor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-primary" />
                      <span className="text-foreground">{doctor.phone}</span>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-primary" />
                      <span className="text-foreground">{doctor.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">{doctor.bio}</p>

                  <div className="bg-muted/50 p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>About:</strong> {doctor.name} is a highly skilled {doctor.specialty} with extensive experience in providing comprehensive medical care.
                    </p>
                    {doctor.profile_data?.treats && doctor.profile_data.treats.length > 0 && (
                      <div className="mt-3">
                        <strong className="text-sm text-foreground">Treats:</strong>
                        <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                          {doctor.profile_data.treats.slice(0, 5).map((treat, idx) => (
                            <li key={idx}>{treat}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Link href={`/appointment?doctorId=${doctor.id}`}>Book Appointment</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Department Doctors */}
          {departmentDoctors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Other Doctors in {doctor.specialty}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departmentDoctors.map((doc) => (
                  <motion.div key={doc.id} whileHover={{ y: -8 }} className="group cursor-pointer">
                    <Link href={`/doctors/${doc.id}`}>
                      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden bg-muted">
                          <Image
                            src={doc.image_url || '/placeholder.svg'}
                            alt={doc.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg text-foreground mb-1">{doc.name}</h3>
                          <p className="text-sm text-primary font-medium mb-2">{doc.specialty}</p>
                          <p className="text-xs text-muted-foreground mb-4 flex-1">
                            {doc.experience_years ?? 0}+ years experience
                          </p>
                          <Button
                            asChild
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <Link href={`/appointment?doctorId=${doc.id}`}>
                              Book Appointment
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
