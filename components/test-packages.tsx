'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Package {
  title: string;
  subtitle: string;
  discountedPrice: string;
  originalPrice: string;
  investigations: string[];
}

const packages: Package[] = [
  {
    title: 'EXECUTIVE HEALTH CHECK-UP',
    subtitle: 'Male / Female',
    discountedPrice: '10,800',
    originalPrice: '16,480',
    investigations: [
      'CBC+ESR',
      'ECG',
      'Lipid Profile Fasting',
      'Fasting Blood Sugar (FBS)',
      'HbA1C',
      'Creatinine with eGFR',
    ],
  },
  {
    title: 'WHOLE BODY CHECK-UP',
    subtitle: 'Male - Age below 45 yrs',
    discountedPrice: '17,800',
    originalPrice: '25,410',
    investigations: [
      'CBC+ESR',
      'ECG',
      'Echo-2D',
      'Lipid Profile Fasting',
      'Fasting Blood Sugar (FBS)',
      'HbA1C',
    ],
  },
  {
    title: 'WHOLE BODY CHECK-UP',
    subtitle: 'Female - Age below 45 yrs',
    discountedPrice: '20,800',
    originalPrice: '29,580',
    investigations: [
      'CBC+ESR',
      'ECG',
      'Echo-2D',
      'Lipid Profile Fasting',
      'Fasting Blood Sugar (FBS)',
      'HbA1C',
    ],
  },
  {
    title: 'WHOLE BODY CHECK-UP',
    subtitle: 'Male - Age above 45 yrs',
    discountedPrice: '20,700',
    originalPrice: '29,530',
    investigations: [
      'CBC+ESR',
      'ECG',
      'Echo-2D',
      'ETT',
      'Lipid Profile Fasting',
      'Fasting Blood Sugar (FBS)',
    ],
  },
];

const TestPackages = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header Image Section */}
      <div
        className="w-full h-64 md:h-80 relative overflow-hidden"
        style={{
          backgroundImage: 'url("/bg_img.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-blue-200/30 backdrop-blur-sm"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Health Check-Up Packages
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg mb-2">
            Book your schedule today. For Appointment & further query call us on:
          </p>
          <p className="text-3xl md:text-4xl font-bold text-green-600">10602</p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col py-0"
            >
              {/* Package Header */}
              <div className="bg-teal-500 text-white px-6 py-4">
                <h3 className="font-bold  mb-1">{pkg.title}</h3>
                <p className="text-sm text-teal-50">{pkg.subtitle}</p>
              </div>

              {/* Package Body */}
              <div className="px-6 py-6 flex-1 flex flex-col">
                {/* Pricing */}
                <div className="mb-6">
                  <div className="mb-2">
                    <span className="text-gray-600 text-sm">Discounted Package Rate:</span>
                    <p className="text-2xl font-bold text-primary">
                      BDT {pkg.discountedPrice}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Original Investigation Rate:</span>
                    <p className="text-lg text-gray-700">BDT {pkg.originalPrice}</p>
                  </div>
                </div>

                {/* Investigations List */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                    Included Investigations:
                  </h4>
                  <ul className="space-y-2">
                    {pkg.investigations.map((investigation, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Plus className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700 text-sm">{investigation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestPackages;