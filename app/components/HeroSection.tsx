'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './HeroSection.css';

export default function HeroSection() {
  const logoRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate logo
    if (logoRef.current) {
      const paths = logoRef.current.querySelectorAll('.cls-1');
      gsap.set(logoRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(paths, { fillOpacity: 0 });

      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'sine.out',
      });

      tl.to(
        paths,
        {
          fillOpacity: 1,
          duration: 1.4,
          ease: 'power1.out',
        },
        0
      );
    }
  }, []);

  // Add mouse magnetism effect
  useEffect(() => {
    if (!logoRef.current || !sectionRef.current) return;

    const logo = logoRef.current;
    const paths = logo.querySelectorAll('.cls-1');
    const magnetStrength = 30;

    const handleMouseMove = (e: MouseEvent) => {
      const logoRect = logo.getBoundingClientRect();
      const mouseX = e.clientX - logoRect.left;
      const mouseY = e.clientY - logoRect.top;

      paths.forEach((path) => {
        const pathRect = path.getBoundingClientRect();
        const pathCenterX = pathRect.left - logoRect.left + pathRect.width / 2;
        const pathCenterY = pathRect.top - logoRect.top + pathRect.height / 2;

        const distanceX = mouseX - pathCenterX;
        const distanceY = mouseY - pathCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const maxDistance = 150;
        const attractionForce = Math.max(0, 1 - distance / maxDistance);

        const moveX = (distanceX / distance) * attractionForce * magnetStrength;
        const moveY = (distanceY / distance) * attractionForce * magnetStrength;
        const scaleValue = 1 + attractionForce * 0.1;

        gsap.to(path, {
          x: moveX,
          y: moveY,
          scale: scaleValue,
          duration: 0.5,
          overwrite: 'auto',
          ease: 'power2.out',
        });
      });
    };

    const handleMouseLeave = () => {
      paths.forEach((path) => {
        gsap.to(path, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          overwrite: 'auto',
          ease: 'elastic.out(1, 0.5)',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    logo.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      logo.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-section">
      {/* Logo SVG */}
      <svg
        ref={logoRef}
        className="hero-logo"
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 350 100"
      >
        <defs>
          <style>
            {`
              .cls-1 {
                fill: #231f20;
                stroke-width: 0px;
                cursor: pointer;
                transition: all 0.3s ease;
              }
            `}
          </style>
        </defs>
        <path className="cls-1" d="M28.31,61.96H9.81l-3.55,9.66H1.95l14.84-40.15h4.6l14.78,40.15h-4.31l-3.55-9.66ZM27.09,58.58l-8.03-22-8.03,22h16.06Z"/>
        <path className="cls-1" d="M70.21,39.84v31.77h-4.07v-5.59c-.93,1.98-2.37,3.49-4.31,4.54-1.94,1.05-4.11,1.57-6.52,1.57-3.8,0-6.91-1.17-9.31-3.52-2.41-2.35-3.61-5.75-3.61-10.21v-18.56h4.02v18.1c0,3.45.86,6.09,2.59,7.91,1.73,1.82,4.08,2.73,7.07,2.73s5.51-.97,7.33-2.91c1.82-1.94,2.73-4.79,2.73-8.55v-17.28h4.07Z"/>
        <path className="cls-1" d="M81.53,69.55c-2.31-1.69-3.6-3.99-3.87-6.9h4.19c.19,1.79,1.04,3.23,2.53,4.34,1.49,1.11,3.5,1.66,6.02,1.66,2.21,0,3.95-.52,5.21-1.57,1.26-1.05,1.89-2.35,1.89-3.9,0-1.09-.35-1.98-1.05-2.68-.7-.7-1.58-1.25-2.65-1.66-1.07-.41-2.51-.84-4.34-1.31-2.37-.62-4.29-1.24-5.76-1.86-1.48-.62-2.73-1.54-3.75-2.76-1.03-1.22-1.54-2.86-1.54-4.92,0-1.55.47-2.99,1.4-4.31.93-1.32,2.25-2.37,3.96-3.14,1.71-.78,3.65-1.16,5.82-1.16,3.41,0,6.17.86,8.26,2.59,2.1,1.73,3.22,4.1,3.38,7.13h-4.07c-.12-1.86-.84-3.37-2.18-4.51-1.34-1.14-3.17-1.72-5.5-1.72-2.06,0-3.72.49-5,1.46-1.28.97-1.92,2.17-1.92,3.61,0,1.24.38,2.26,1.13,3.06.76.8,1.7,1.42,2.82,1.86,1.12.45,2.64.94,4.54,1.48,2.29.62,4.11,1.22,5.47,1.8,1.36.58,2.52,1.44,3.49,2.56.97,1.13,1.47,2.62,1.51,4.48,0,1.71-.47,3.23-1.4,4.57s-2.23,2.4-3.9,3.17c-1.67.78-3.59,1.16-5.76,1.16-3.65,0-6.62-.84-8.93-2.53Z"/>
        <path className="cls-1" d="M114.5,43.28v19.73c0,1.94.37,3.28,1.11,4.02.74.74,2.04,1.11,3.9,1.11h3.72v3.49h-4.36c-2.87,0-5-.67-6.4-2.01-1.4-1.34-2.1-3.54-2.1-6.61v-19.73h-4.42v-3.43h4.42v-7.97h4.13v7.97h8.73v3.43h-8.73Z"/>
        <path className="cls-1" d="M129.86,32.98c-.58-.58-.87-1.3-.87-2.15s.29-1.56.87-2.12c.58-.56,1.28-.84,2.1-.84s1.51.28,2.1.84c.58.56.87,1.27.87,2.12s-.29,1.57-.87,2.15c-.58.58-1.28.87-2.1.87s-1.51-.29-2.1-.87ZM133.99,39.84v31.77h-4.07v-31.77h4.07Z"/>
        <path className="cls-1" d="M167.45,42.78c2.41,2.35,3.61,5.75,3.61,10.21v18.62h-4.02v-18.16c0-3.45-.86-6.09-2.59-7.91-1.73-1.82-4.08-2.73-7.07-2.73s-5.51.97-7.33,2.91c-1.82,1.94-2.74,4.79-2.74,8.55v17.34h-4.07v-31.77h4.07v5.41c1.01-1.94,2.46-3.42,4.36-4.45,1.9-1.03,4.05-1.54,6.46-1.54,3.8,0,6.91,1.17,9.31,3.52Z"/>
        <path className="cls-1" d="M208.27,71.62l-13.73-18.04v18.04h-9.95V30.77h9.95v17.92l13.62-17.92h11.7l-15.83,20.02,16.41,20.83h-12.16Z"/>
        <path className="cls-1" d="M254.04,42.49c2.27,2.46,3.4,5.85,3.4,10.15v18.97h-9.89v-17.63c0-2.17-.56-3.86-1.69-5.06-1.13-1.2-2.64-1.8-4.54-1.8s-3.41.6-4.54,1.8c-1.12,1.2-1.69,2.89-1.69,5.06v17.63h-9.95v-32.47h9.95v4.31c1.01-1.43,2.37-2.57,4.07-3.4,1.71-.83,3.63-1.25,5.76-1.25,3.8,0,6.84,1.23,9.11,3.7Z"/>
        <path className="cls-1" d="M270.56,70.05c-2.54-1.36-4.54-3.3-5.99-5.82-1.46-2.52-2.18-5.47-2.18-8.85s.74-6.27,2.21-8.82c1.47-2.54,3.49-4.49,6.05-5.85,2.56-1.36,5.43-2.04,8.61-2.04s6.05.68,8.61,2.04c2.56,1.36,4.58,3.31,6.05,5.85,1.47,2.54,2.21,5.48,2.21,8.82s-.75,6.28-2.24,8.82c-1.49,2.54-3.53,4.49-6.11,5.85s-5.46,2.04-8.64,2.04-6.04-.68-8.58-2.04ZM284.01,61.38c1.34-1.4,2.01-3.39,2.01-5.99s-.65-4.6-1.95-5.99c-1.3-1.4-2.9-2.1-4.8-2.1s-3.55.69-4.83,2.07c-1.28,1.38-1.92,3.39-1.92,6.02s.63,4.6,1.89,5.99c1.26,1.4,2.84,2.1,4.74,2.1s3.52-.7,4.86-2.1Z"/>
        <path className="cls-1" d="M348.05,39.15l-8.79,32.47h-11l-5.12-21.07-5.3,21.07h-10.94l-8.85-32.47h9.95l4.6,23.22,5.47-23.22h10.53l5.53,23.1,4.54-23.1h9.37Z"/>
      </svg>
    </section>
  );
}
