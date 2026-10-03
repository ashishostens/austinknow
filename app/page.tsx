'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import AnimatedHeroCanvas, { setAudioMuted, getAudioMuted } from './components/AnimatedHeroCanvas';

const EXPERTISE_WORDS = ["Medical Sciences", "SEO", "Coding", "Design"];
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrambledText, setScrambledText] = useState('');
  const [muted, setMuted] = useState(false);
  const frameRef = useRef<number | null>(null);
  const iterationRef = useRef(0);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
  };

  // Scramble/decode effect: text appears as random characters that resolve into the real word
  const scrambleTo = useCallback((word: string) => {
    iterationRef.current = 0;
    const totalIterations = word.length;
    
    const animate = () => {
      iterationRef.current += 0.4; // Speed of decode
      const progress = iterationRef.current;
      
      const decoded = word
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < Math.floor(progress)) return char; // Resolved
          return CHARS[Math.floor(Math.random() * CHARS.length)]; // Still scrambled
        })
        .join('');
      
      setScrambledText(decoded);
      
      if (progress < totalIterations) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    scrambleTo(EXPERTISE_WORDS[activeIndex]);
  }, [activeIndex, scrambleTo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % EXPERTISE_WORDS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-full min-h-screen overflow-hidden text-black dark:text-white">
      {/* Background glowing atmospheric orbs dynamically synced with 3D theme */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[140px] animate-pulse-glow transition-all duration-1000"
        style={{
          backgroundColor:
            activeIndex === 0 ? 'rgba(20, 184, 166, 0.22)' : // Teal
            activeIndex === 1 ? 'rgba(147, 51, 234, 0.22)' : // Violet
            activeIndex === 2 ? 'rgba(37, 99, 235, 0.22)' :  // Blue
            'rgba(244, 63, 94, 0.22)',                      // Rose
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[140px] animate-pulse-glow transition-all duration-1000" 
        style={{ 
          animationDelay: '2s',
          backgroundColor:
            activeIndex === 0 ? 'rgba(45, 212, 191, 0.15)' :
            activeIndex === 1 ? 'rgba(192, 132, 252, 0.15)' :
            activeIndex === 2 ? 'rgba(96, 165, 250, 0.15)' :
            'rgba(251, 113, 133, 0.15)',
        }} 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-8 lg:pt-16 lg:pb-0 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* LEFT COLUMN: Text content */}
          <div className="flex flex-col text-left justify-center order-2 lg:order-1">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-brand-secondary mb-8 w-max"
            >
              <Sparkles className="w-4 h-4" />
              <span>Welcome to the future of learning</span>
            </motion.div>

            {/* Hero Title */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 relative"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-display text-white">
                Austin<span className="text-gradient">Know</span>
              </h1>
            </motion.div>

            {/* Subtitle with Scramble Decode Effect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-xl text-lg md:text-xl text-slate-300 font-sans mb-10 leading-relaxed min-h-[80px]"
            >
              Mastering the intersection of{' '}
              <strong className="text-brand-primary font-bold font-mono tracking-wider drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                {scrambledText}
              </strong>
              <br />
              and AI. A hub for creative minds and technical builders.
            </motion.div>

            {/* CTAs with high-contrast, premium dark-mode gradients */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              {/* Primary button: Vibrant Electric Indigo / Cyan Gradient with dark border and neon backlight */}
              <button className="relative group px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 shadow-[0_0_25px_rgba(59,130,246,0.45)] hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] hover:scale-[1.03] transition-all duration-300 border border-white/20">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Content <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Secondary button: Sleek dark glassy border with subtle gradient glow */}
              <button className="px-8 py-4 rounded-xl font-semibold text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 hover:border-cyan-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(45,212,191,0.25)] hover:scale-[1.02] transition-all duration-300 backdrop-blur-md">
                Get Started
              </button>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: 3D Constellation Canvas */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full h-[450px] md:h-[550px] order-1 lg:order-2 relative flex flex-col items-center justify-center"
          >
            <AnimatedHeroCanvas activeIndex={activeIndex} />
          </motion.div>
        </div>
      </div>

      {/* Sleek Minimal Audio Mute/Unmute Soundscape Controller */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleSound}
          title={muted ? "Unmute cosmic soundscape" : "Mute cosmic soundscape"}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-300"
        >
          {muted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-mono tracking-wider">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono tracking-wider flex items-center gap-1">
                Audio On
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}
