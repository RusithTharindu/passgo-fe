import { FileCheck, Clock, Globe } from 'lucide-react';
import { ServiceCard } from './service-card';

export const ServicesSection = () => {
  return (
    <section className='py-10 md:py-14 lg:py-20'>
      <div className='container px-4 md:px-6 mx-auto max-w-6xl'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2 max-w-3xl mx-auto'>
            <h2 className='text-2xl font-bold tracking-tighter text-[#112e51] sm:text-3xl md:text-4xl'>
              Passport Services
            </h2>
            <p className='text-gray-600 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed'>
              Our online portal provides secure and efficient passport services for Sri Lankan
              citizens.
            </p>
          </div>
        </div>
        <div className='mx-auto grid gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'>
          <ServiceCard
            icon={FileCheck}
            title='New Applications'
            description='Apply for your first Sri Lankan passport'
            content='Complete your application online and schedule an appointment at your nearest passport acceptance facility.'
          />
          <ServiceCard
            icon={Clock}
            title='Renewals'
            description='Renew your existing passport'
            content='Eligible passport holders can renew online without having to visit a passport acceptance facility.'
          />
          <ServiceCard
            icon={Globe}
            title='Expedited Service'
            description='Get your passport faster'
            content='For an additional fee, expedite your passport application for faster processing times.'
            className='sm:col-span-2 lg:col-span-1'
          />
        </div>
      </div>
    </section>
  );
};
