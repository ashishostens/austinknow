'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './HeroSection.css';

export default function HeroSection() {
  const nameRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate left content
    if (leftContentRef.current) {
      gsap.set(leftContentRef.current, { opacity: 0, y: 20 });
      tl.to(
        leftContentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        0.3
      );
    }

    // Animate main name with letter-by-letter effect
    if (nameRef.current) {
      const austin = nameRef.current.querySelector('.austin-line');
      const know = nameRef.current.querySelector('.know-line');

      if (austin) {
        const letters = austin.querySelectorAll('.letter');
        gsap.set(letters, { opacity: 0, y: 30 });
        tl.to(
          letters,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
          },
          0.2
        );
      }

      if (know) {
        const letters = know.querySelectorAll('.letter');
        gsap.set(letters, { opacity: 0, y: 30 });
        tl.to(
          letters,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
          },
          0.45
        );
      }
    }

    // Animate dividing line
    const line = document.querySelector('.divider-line');
    if (line) {
      gsap.set(line, { scaleY: 0 });
      tl.to(line, {
        scaleY: 1,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    // Animate right content
    if (rightContentRef.current) {
      gsap.set(rightContentRef.current, { opacity: 0, y: 20 });
      tl.to(
        rightContentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        0.3
      );
    }
  }, []);

  // Interactive mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePos({ x, y });

      // Subtle parallax effect on left and right content
      if (leftContentRef.current) {
        gsap.to(leftContentRef.current, {
          x: (x - 0.5) * 20,
          y: (y - 0.5) * 20,
          duration: 0.3,
          overwrite: 'auto',
        });
      }

      if (rightContentRef.current) {
        gsap.to(rightContentRef.current, {
          x: -(x - 0.5) * 20,
          y: -(y - 0.5) * 20,
          duration: 0.3,
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add hover effects to roles and info
  useEffect(() => {
    const roles = document.querySelectorAll('.role');
    const infos = document.querySelectorAll('.info-title, .info-subtitle');

    const handleHoverIn = (el: Element) => {
      gsap.to(el, {
        scale: 1.1,
        color: '#000000',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleHoverOut = (el: Element) => {
      gsap.to(el, {
        scale: 1,
        color: '#666666',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    roles.forEach((role) => {
      role.addEventListener('mouseenter', () => handleHoverIn(role));
      role.addEventListener('mouseleave', () => handleHoverOut(role));
    });

    infos.forEach((info) => {
      info.addEventListener('mouseenter', () => handleHoverIn(info));
      info.addEventListener('mouseleave', () => handleHoverOut(info));
    });

    return () => {
      roles.forEach((role) => {
        role.removeEventListener('mouseenter', () => handleHoverIn(role));
        role.removeEventListener('mouseleave', () => handleHoverOut(role));
      });
      infos.forEach((info) => {
        info.removeEventListener('mouseenter', () => handleHoverIn(info));
        info.removeEventListener('mouseleave', () => handleHoverOut(info));
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="hero-container">

        {/* Left content */}
        <div ref={leftContentRef} className="hero-left">
          <div className="hero-roles">
            <p className="role">Creative</p>
            <p className="role">Platform</p>
          </div>
        </div>

        {/* Main name with divider */}
        <div className="hero-center">
          <div className="divider-line"></div>
          <div ref={nameRef} className="hero-name">
            <div className="austin-line">
              <span className="letter">A</span>
              <span className="letter">u</span>
              <span className="letter">s</span>
              <span className="letter">t</span>
              <span className="letter">i</span>
              <span className="letter">n</span>
            </div>
            <div className="know-line">
              <span className="letter">K</span>
              <span className="letter">n</span>
              <span className="letter">o</span>
              <span className="letter">w</span>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div ref={rightContentRef} className="hero-right">
          <div className="hero-info">
            <p className="info-title">Knowledge</p>
            <p className="info-subtitle">Hub</p>
          </div>
        </div>
      </div>
    </section>
  );
}
