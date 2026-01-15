
import React, { useEffect } from 'react';
import Hero from '@/components/Home/Hero';
import Features from '@/components/Home/Features';
import HowItWorks from '@/components/Home/HowItWorks';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import Testimonials from '@/components/Home/Testimonials';
import ProfessionalSection from '@/components/Home/ProfessionalSection';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <ProfessionalSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
