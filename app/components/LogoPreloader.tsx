'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './LogoPreloader.css';

export default function LogoPreloader() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('.logo-path');
    pathsRef.current = Array.from(paths) as SVGPathElement[];

    // Create a timeline for smooth sequential animations
    const tl = gsap.timeline();

    pathsRef.current.forEach((path, index) => {
      const length = (path as any).getTotalLength?.() || 1000;

      // Set initial state
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: 'none',
        stroke: '#231f20',
        opacity: 0.3,
        filter: 'drop-shadow(0 0 0px #231f20)',
      });

      // Tubelight flickering effect - multiple blinks before staying on
      tl.to(
        path,
        {
          opacity: 0.1,
          duration: 0.08,
          ease: 'power1.inOut',
        },
        index * 0.1
      );

      tl.to(
        path,
        {
          opacity: 0.5,
          duration: 0.06,
          ease: 'power1.inOut',
        },
        index * 0.1 + 0.08
      );

      tl.to(
        path,
        {
          opacity: 0.2,
          duration: 0.07,
          ease: 'power1.inOut',
        },
        index * 0.1 + 0.14
      );

      tl.to(
        path,
        {
          opacity: 0.8,
          duration: 0.05,
          ease: 'power1.inOut',
        },
        index * 0.1 + 0.21
      );

      // Main smooth stroke drawing with glow
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          opacity: 1,
          filter: 'drop-shadow(0 0 8px rgba(35, 31, 32, 0.6))',
          duration: 1.5,
          ease: 'power3.inOut',
        },
        index * 0.15 + 0.26
      );

      // Smooth fill animation with glow intensity
      tl.to(
        path,
        {
          fill: '#231f20',
          filter: 'drop-shadow(0 0 12px rgba(35, 31, 32, 0.8))',
          duration: 0.8,
          ease: 'power2.inOut',
        },
        index * 0.15 + 1.76
      );

      // Settle glow
      tl.to(
        path,
        {
          filter: 'drop-shadow(0 0 6px rgba(35, 31, 32, 0.4))',
          duration: 0.6,
          ease: 'power1.inOut',
        },
        index * 0.15 + 2.56
      );
    });

    // Add subtle pulsing glow at the end
    tl.to(
      pathsRef.current,
      {
        filter: 'drop-shadow(0 0 8px rgba(35, 31, 32, 0.6))',
        duration: 0.4,
        ease: 'sine.inOut',
        repeat: 2,
        yoyo: true,
      },
      tl.duration() - 0.4
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="preloader-container">
      <svg
        ref={svgRef}
        className="logo-preloader"
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 512 512"
      >
        <defs>
          <style>
            {`
              .cls-1 {
                stroke-linecap: round;
                stroke-linejoin: round;
              }

              .cls-2 {
                fill: none;
                stroke: #231f20;
                stroke-miterlimit: 10;
                stroke-opacity: 0;
                stroke-width: .1px;
              }
            `}
          </style>
        </defs>
        <circle className="cls-2" cx="256" cy="256" r="255" />
        <g className="logo-group">
          <path
            className="cls-1 logo-path"
            d="M311.91,190.26h-111.82l-21.45,58.06h-26.02L242.28,7h27.78l89.32,241.32h-26.02l-21.45-58.06ZM304.53,169.98l-48.53-132.2-48.53,132.2h97.05Z"
          />
          <path
            className="cls-1 logo-path"
            d="M133.5,403.97l108.19-82.47h-108.19v-59.76h245v59.76h-107.49l107.49,81.77v70.24l-120.06-95.05-124.94,98.55v-73.03Z"
          />
        </g>
      </svg>
    </div>
  );
}
