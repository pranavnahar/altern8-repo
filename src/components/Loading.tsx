'use client';
import React from 'react';
import { motion } from 'framer-motion';

const loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="w-10 h-10 bg-blue-500"
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 360, 0],
          borderRadius: ['20%', '50%', '20%'],
        }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
    </div>
  );
};

export default loading;
