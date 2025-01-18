'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
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


const TypingAnimation = () => {
  //animating taglines
  const taglines = [
    'Financial Acumen',
    'Technology',
    'Human Resources',
    'Organizational Transformation',
    'Innovation',
    'Sustainability',
    'Conscious Growth',
    'Entrepreneurship',
    'Transformative initiates',
  ];
  //
  const textIndex = useMotionValue(0);
  const baseText = useTransform(textIndex, latest => taglines[latest] || '');
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const displayText = useTransform(rounded, latest => baseText.get().slice(0, latest));
  const updatedThisRound = useMotionValue(true);

  //useffect to trigger animation
  useEffect(() => {
    animate(count, 60, {
      type: 'tween',
      delay: 0.5,
      duration: 1.3,
      ease: 'easeIn',
      repeat: Infinity,
      repeatType: 'reverse',
      repeatDelay: 0.1,
      onUpdate(latest) {
        if (updatedThisRound.get() === true && latest > 0) {
          updatedThisRound.set(false);
        } else if (updatedThisRound.get() === false && latest === 0) {
          if (textIndex.get() === taglines.length - 1) {
            textIndex.set(0);
          } else {
            textIndex.set(textIndex.get() + 1);
          }
          updatedThisRound.set(true);
        }
      },
    });
  }, []);

  return <motion.div className="inline">{displayText}</motion.div>;
};


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
        <h2 className="text-3xl font-bold text-center mb-8 ">Meet Our Team</h2>
        <p className="text-sm font-normal text-center text-gray-400 leading-relaxed mx-auto max-w-xl">
          A group of passionate individuals committed to pushing the boundaries of conscious
          capitalism, blending purpose with profit, and driving positive impact in everything we do.
        </p>

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
                {/* <DialogTitle className="text-2xl font-bold text-gray-200">
                  Our Founding Team's Expertise
                </DialogTitle> */}
                <DialogDescription className="text-gray-400 mt-4">
                  <p className="mb-4">
                  <p className="text-base font-medium">The founding team has Expertise in{' '}<b><TypingAnimation /></b></p>
                    <br />
                    The team's entrepreneurial vision has seen the successful launch and expansion
                    of businesses across 32 countries, with over $700 million in transactions. Their
                    efforts have included establishing operations for a €200 million LSE-listed
                    carbon finance firm and leading social enterprise private equity initiatives in
                    Asia. With a passion for conscious capitalism, they have combined modern
                    business strategies with ancient practices, dedicating significant time to
                    meditation and personal growth.
                    <br /> <br />
                    In the realm of HR and coaching, the team has extensive experience in talent
                    acquisition, policy consulting, and fostering Diversity & Inclusion initiatives.
                    They have created inclusive workplaces, facilitated performance appraisals for
                    organizations of varying scales, and led over 20 workshops and retreats
                    globally. By integrating modern coaching techniques with practices like NLP,
                    hypnotherapy, and meditation, they address complex analytical, operational, and
                    relational challenges effectively.
                    <br /> <br />
                    On the technology front, the team brings 24 years of collective expertise in
                    developing scalable solutions, including SaaS products generating $10 million in
                    revenue and modernizing tech platforms. They specialize in building
                    fault-tolerant systems with 100% uptime and delivering high-traffic websites,
                    B2B applications, and CRM systems that have collectively achieved $42 million in
                    revenue. By leveraging technology and strategic roadmaps, they address key
                    business challenges and capitalize on emerging opportunities while cultivating
                    high-performing, globally distributed teams.
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
