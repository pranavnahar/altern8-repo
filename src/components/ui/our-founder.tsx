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
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-300">Our Founders</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(card => (
            <div
              key={card.title}
              className="h-[24.5rem] relative flex items-center justify-center backdrop-brightness-90"
            >
              <DirectionAwareHover imageUrl={card.src}>
                <div className="text-left">
                  <p className="font-bold text-xl">{card.title}</p>
                  <p className="font-normal text-sm">{card.role}</p>
                </div>
              </DirectionAwareHover>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-10 py-4 text-base pt-1.5 text-gray-300 border-gray-500 hover:bg-[#6e3050]/30 hover:text-white transition-colors"
              >
                More on our Founders
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
                  Our Founder's Journey
                </DialogTitle>
                <DialogDescription className="text-gray-400 mt-4">
                  <p className="mb-4">
                    Our founding team has a proven track record in scaling successful ventures
                    across industries:
                    <br />
                    <br />
                    <strong>Pranav</strong>: At 19, Pranav launched his first business in Oslo,
                    expanding to 32 countries within three years before executing a profitable exit.
                    He has been involved in transactions exceeding $700 million and led the launch
                    of Indian operations for a €200 million carbon finance firm listed on the London
                    Stock Exchange.
                    <br />
                    <br />
                    <strong>Poonam</strong>: With extensive expertise in HR and organizational
                    development, Poonam has implemented talent acquisition strategies, HR policies,
                    and diversity initiatives for startups and large corporations. She co-created
                    20+ international workshops and retreats that blend contemporary coaching with
                    traditional practices, revolutionizing personal and professional development.
                    <br />
                    <br />
                    <strong>Ketan</strong>: Ketan brings over 20 years of technology leadership
                    experience. He developed a SaaS product generating $10 million in revenue and
                    created fault-tolerant systems ensuring 100% uptime. His technical innovations
                    have contributed to $42 million in total revenue, underscoring his ability to
                    transform technology into tangible business value. <br/><br/>Together, this dynamic team's
                    diverse expertise in business expansion, HR innovation, and technology
                    leadership makes them uniquely equipped to drive growth and create value in
                    their future ventures.
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
