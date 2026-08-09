'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import './WolfIllustration.css';

export default function WolfIllustration() {
  const wolfRef = useRef<SVGSVGElement>(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (!wolfRef.current) return;

    const wolf = wolfRef.current;

    // Entrance animation
    gsap.set(wolf, { opacity: 0, scale: 0.8, y: 20 });
    gsap.to(wolf, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      ease: 'back.out',
    });

    // Continuous gentle floating animation
    gsap.to(wolf, {
      y: -10,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, []);

  const strokeColor = theme === 'dark' ? '#ffffff' : '#000000';
  const fillColor = theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <svg
      ref={wolfRef}
      className="wolf-illustration"
      viewBox="0 0 200 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="100" cy="100" rx="45" ry="50" fill="none" stroke={strokeColor} strokeWidth="2" />

      {/* Head */}
      <circle cx="100" cy="40" r="30" fill="none" stroke={strokeColor} strokeWidth="2" />

      {/* Ears */}
      <path d="M 75 15 L 70 -5 L 80 10 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      <path d="M 125 15 L 130 -5 L 120 10 Z" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />

      {/* Snout */}
      <ellipse cx="100" cy="50" rx="18" ry="15" fill="none" stroke={strokeColor} strokeWidth="1.5" />

      {/* Eyes */}
      <circle cx="90" cy="35" r="4" fill={fillColor} />
      <circle cx="110" cy="35" r="4" fill={fillColor} />

      {/* Nose */}
      <circle cx="100" cy="52" r="2" fill={fillColor} />

      {/* Front legs */}
      <line x1="80" y1="145" x2="75" y2="160" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="145" x2="125" y2="160" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />

      {/* Back legs */}
      <line x1="65" y1="140" x2="55" y2="160" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="135" y1="140" x2="145" y2="160" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />

      {/* Tail */}
      <path
        d="M 60 90 Q 40 80 35 60"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Chest marking */}
      <ellipse cx="100" cy="110" rx="15" ry="20" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
