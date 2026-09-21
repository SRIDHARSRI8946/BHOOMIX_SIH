import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { PageTransition } from '../common/PageTransition';
import { GlobalLottieBackground } from '../ui/GlobalLottieBackground';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans relative">
      {/* Total Page High-Contrast Lottie Earth Background (Global.json) */}
      <GlobalLottieBackground opacity={0.45} invert={true} />

      <Navbar />
      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
