// src/components/HeroSection.js
import React from 'react';
import { motion } from 'framer-motion';

function HeroSection() {
  return (
    <section className="hero bg-gradient-to-r from-[#6CC0E6] to-[#FF6F61] text-black h-screen flex flex-col justify-center items-center">
      <motion.h1
        className="text-6xl font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        AI-Dynamic Banner & Video Generation
      </motion.h1>
      
      <motion.p
        className="mt-4 text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Create dynamic, stunning visuals in seconds.
      </motion.p>

      <motion.button
        className="mt-8 bg-white text-[#FF6F61] px-6 py-3 rounded-md shadow-lg transition duration-300 hover:bg-[#F0F4F8]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.location.href = '/signup'}
      >
        Get Started for Free
      </motion.button>
    </section>
  );
}

export default HeroSection;
