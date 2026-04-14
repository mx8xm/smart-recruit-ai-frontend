import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { flushSync } from 'react-dom';

// Add missing type definition for View Transitions API
declare global {
  interface Document {
    startViewTransition?: (callback: () => Promise<void> | void) => {
      ready: Promise<void>;
      finished: Promise<void>;
      updateCallbackDone: Promise<void>;
    };
  }
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: (event: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  // Initialize state - Default to DARK mode
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      // Default to true (Dark) if no preference
      return true;
    }
    return true;
  });

  // Sync with DOM
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = async (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const nextDark = !isDark;
    const isTauri = "__TAURI_INTERNALS__" in window;

    document.documentElement.classList.add("disable-theme-transitions");

    // If browser doesn't support View Transitions or user prefers reduced motion, fallback to instant toggle
    if (
      isTauri ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsDark(nextDark);
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("disable-theme-transitions");
      });
      return;
    }

    const transition = document.startViewTransition(() => {
        flushSync(() => {
            setIsDark(nextDark);
        });
    });

    await transition.ready;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: nextDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 700, // Slower animation as requested
        easing: 'ease-in-out',
        pseudoElement: nextDark
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      }
    );

    transition.finished.finally(() => {
      document.documentElement.classList.remove("disable-theme-transitions");
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};