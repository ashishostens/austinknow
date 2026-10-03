'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

export default function Header() {
  const logoRef = useRef<SVGSVGElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const menuItemsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    if (logoRef.current) {
      const paths = logoRef.current.querySelectorAll('.header-logo-path');
      gsap.fromTo(
        paths,
        { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 0, fill: 'transparent' },
        { 
          strokeDashoffset: 0, 
          opacity: 1, 
          fill: 'currentColor', 
          duration: 1.5, 
          stagger: 0.2, 
          ease: 'power2.inOut',
          delay: 0.3
        }
      );
    }

    if (menuItemsRef.current) {
      const items = menuItemsRef.current.children;
      gsap.fromTo(
        items,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.6 }
      );
    }
  }, []);

  return (
    <header 
      ref={headerRef} 
      className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--background)]/80 backdrop-blur-lg shadow-sm"
    >
      <Link href="/" className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 relative">
          <div className="absolute inset-0 z-0">
             {/* 3D background removed as requested */}
          </div>
          <svg
            ref={logoRef}
            className="w-full h-full relative z-10 text-black dark:text-white"
            viewBox="0 0 512 512"
          >
            <g className="logo-group">
              <path
                className="header-logo-path"
                stroke="currentColor"
                strokeWidth="4"
                d="M311.91,190.26h-111.82l-21.45,58.06h-26.02L242.28,7h27.78l89.32,241.32h-26.02l-21.45-58.06ZM304.53,169.98l-48.53-132.2-48.53,132.2h97.05Z"
              />
              <path
                className="header-logo-path"
                stroke="currentColor"
                strokeWidth="4"
                d="M133.5,403.97l108.19-82.47h-108.19v-59.76h245v59.76h-107.49l107.49,81.77v70.24l-120.06-95.05-124.94,98.55v-73.03Z"
              />
            </g>
          </svg>
        </div>
        <span className="font-bold text-2xl tracking-tight text-black dark:text-white drop-shadow-sm">Austin<span className="text-brand-primary">Know</span></span>
      </Link>

      <nav className="relative z-10 hidden md:block">
        <ul ref={menuItemsRef} className="flex gap-8 text-base font-semibold text-black dark:text-white">
          <li className="hover:text-brand-primary transition-colors cursor-pointer"><Link href="/">Home</Link></li>
          <li className="hover:text-brand-primary transition-colors cursor-pointer"><Link href="/blog">Blog</Link></li>
          <li className="hover:text-brand-primary transition-colors cursor-pointer"><Link href="/about">About</Link></li>
          <li className="hover:text-brand-primary transition-colors cursor-pointer"><Link href="/services">Services</Link></li>
        </ul>
      </nav>
      
      <div className="relative z-10 md:hidden">
        <button className="text-black dark:text-white hover:text-brand-primary p-2">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </header>
  );
}
