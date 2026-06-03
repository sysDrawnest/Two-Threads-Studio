import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import Learning from './pages/Learning';
import Journal from './pages/Journal';
import About from './pages/About';
import Contact from './pages/Contact';

// Wrapper component to handle AnimatePresence properly with useLocation
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem("tt_visited");
    } catch {
      return true;
    }
  });

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem("tt_visited", "1");
    } catch { }
    setShowIntro(false);
  };

  return (
    <Router>
      <div className="overflow-x-hidden min-h-screen flex flex-col bg-background font-sans text-on-surface">
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        
        <Navbar />
        
        <main className={`flex-1 flex flex-col transition-opacity duration-700 ease-in-out ${showIntro ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
          <AnimatedRoutes />
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}