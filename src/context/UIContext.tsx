import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, startTransition, ReactNode } from 'react';
import { ViewScreen } from '../types';

interface UIContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentScreen: ViewScreen;
  setCurrentScreen: (screen: ViewScreen) => void;
  transitionToScreen: (screen: ViewScreen) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vellum-theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'light';
  });

  const [currentScreen, setCurrentScreenState] = useState<ViewScreen>('discovery');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vellum-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Use React 19 startTransition to mark screen changes as non-urgent
  const transitionToScreen = useCallback((screen: ViewScreen) => {
    startTransition(() => {
      setCurrentScreenState(screen);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, []);

  const setCurrentScreen = useCallback((screen: ViewScreen) => {
    startTransition(() => {
      setCurrentScreenState(screen);
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      currentScreen,
      setCurrentScreen,
      transitionToScreen,
    }),
    [theme, toggleTheme, currentScreen, setCurrentScreen, transitionToScreen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
