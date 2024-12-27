"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DirectionAwareHover } from './direction-aware-hover';
import teams from '../AboutUsPage/constant';


export function FoundersSection() {
  const cards = [
    {
      title: 'Pranav',
      role: 'Investor, Entrepreneur',
      src: '/images/pranav.png',
      fullDescription: () => (
        <p className="text-base text-gray-300">
          Pranav is a visionary entrepreneur with deep expertise in FinTech and investment
          strategies. He brings innovative thinking and strategic insights to transform business
          landscapes.
        </p>
      ),
    },
    {
      title: 'Poonam',
      role: 'Co-Founder',
      src: '/poonam.avif',
      fullDescription: () => (
        <p className="text-base text-gray-300">
          Poonam is a seasoned HR professional with extensive experience in organizational
          development and strategic human resource management.
        </p>
      ),
    },
    {
      title: 'Ketan',
      role: 'Co-Founder & CTO',
      src: '/images/ketan.png',
      fullDescription: () => (
        <p className="text-base text-gray-300">
          Ketan brings unique strategic perspectives and leadership skills to the team, driving
          innovation and growth.
        </p>
      ),
    },
  ];

  return (
    <div
      className="py-16 px-14"
      style={{
        background:
          'linear-gradient(65.92deg, #021457, #19112f 31.84%, #251431 51.79%, #301941 64.24%, #6e3050 99.08%)',
      }}
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-300">Meet Our Team</h2>

        <section className="py-16 px-14">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full text-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {teams.map((team, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.06 }} 
                      transition={{ duration: 0.45 }} 
                      className="flex flex-col items-center"
                    >
                      <img
                        src={team.image}
                        alt={team.name}
                        className="object-cover w-28 h-28 rounded-full"
                      />
                      <h3 className="text-[13px] font-semibold text-center w-full leading-[18px] mt-2">
                        {team.name}
                      </h3>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="text-center mt-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-10 py-4 text-base pt-1.5 text-gray-300 border-gray-500 hover:bg-[#6e3050]/30 hover:text-white transition-colors"
              >
                Get to know our Founding Team
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[625px]"
              style={{
                background:
                  'linear-gradient(65.92deg, #021457, #19112f 31.84%, #251431 51.79%, #301941 64.24%, #6e3050 99.08%)',
                border: '1px solid #6e3050',
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-200">
                  Our Founding Team's Journey
                </DialogTitle>
                <DialogDescription className="text-gray-400 mt-4">
                <p className="mb-4">
                Our founding team has a proven track record of scaling successful ventures
                across diverse industries. At a young age, one of our founders launched a
                business that expanded to 32 countries within three years, culminating in a
                profitable exit. Their experience includes transactions exceeding $700 million
                and spearheading the Indian operations of a €200 million carbon finance firm
                listed on the London Stock Exchange. Another founder brings deep expertise in HR
                and organizational development, having implemented innovative talent acquisition
                strategies, HR policies, and diversity initiatives for startups and large
                corporations. <br /> <br /> They co-created over 20 international workshops and
                retreats, blending modern coaching techniques with traditional practices to
                revolutionize personal and professional growth. With over 20 years of experience
                in technology leadership, another founder has developed SaaS products generating
                millions in revenue and engineered fault-tolerant systems with 100% uptime.
                Their technical innovations have driven substantial business value, contributing
                to tens of millions in revenue.
                <br /> <br />
                Together, this dynamic team's diverse expertise in business expansion, HR
                innovation, and technological leadership uniquely equips them to drive growth
                and create exceptional value in their ventures.
              </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default FoundersSection;
