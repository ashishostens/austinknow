'use client';

import { useEffect, useState } from 'react';
import LogoPreloader from './components/LogoPreloader';
import MolecularBackground from './components/MolecularBackground';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';

function RootLayoutContent({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  return (
    <>
      <MolecularBackground />
      <ThemeToggle />
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black">
          <LogoPreloader />
        </div>
      )}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
}

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show preloader for at least 2.5 seconds, or until page fully loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Also hide when page fully loads (whichever comes first)
    const handleLoad = () => {
      setIsLoading(false);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <ThemeProvider>
      <RootLayoutContent isLoading={isLoading}>{children}</RootLayoutContent>
    </ThemeProvider>
  );
}
