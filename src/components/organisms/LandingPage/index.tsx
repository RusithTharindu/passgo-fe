import React from 'react';
import { HeroSection } from '@/components/molecules/landing/hero-section';
import { ServicesSection } from '@/components/molecules/landing/service-section';
import { ApplicationProcess } from '@/components/molecules/landing/application-process';
import { AssistanceSection } from '@/components/molecules/landing/assistance-section';
import { Footer } from '@/components/molecules/landing/footer';

const LandingPage = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <HeroSection />
        <ServicesSection />
        <ApplicationProcess />
        <AssistanceSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
