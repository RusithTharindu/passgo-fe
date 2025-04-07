import React from 'react';
import { ApplicantServices } from '@/constants/ApplicantServices';
import ServiceCard from '@/components/molecules/Applicant/ServiceCard';

const ApplicantHome = () => {
  return (
    <div className='py-12'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>PassGo Portal</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          We facilitate Sri Lankan citizens to apply passports through online comfortably at their
          fingertips.
        </p>
      </div>

      <div className='space-y-24'>
        {ApplicantServices.map(service => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
};

export default ApplicantHome;
