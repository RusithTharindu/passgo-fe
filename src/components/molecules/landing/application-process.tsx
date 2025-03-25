import { ProcessStep } from './process-step';

export const ApplicationProcess = () => {
  return (
    <section className='bg-[#f1f1f1] py-10 md:py-14 lg:py-20'>
      <div className='container px-4 md:px-6 mx-auto max-w-6xl'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2 max-w-3xl mx-auto'>
            <h2 className='text-2xl font-bold tracking-tighter text-[#112e51] sm:text-3xl md:text-4xl'>
              Application Process
            </h2>
            <p className='text-gray-600 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed'>
              Follow these steps to complete your passport application.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl gap-8 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-4'>
          <ProcessStep
            number={1}
            title='Create Account'
            description='Register for a secure online account to manage your application.'
          />
          <ProcessStep
            number={2}
            title='Complete Form'
            description='Fill out the required information and upload necessary documents.'
          />
          <ProcessStep
            number={3}
            title='Pay Fees'
            description='Submit payment for your passport application and any additional services.'
          />
          <ProcessStep
            number={4}
            title='Submit & Track'
            description='Submit your application and track its status through our portal.'
          />
        </div>
      </div>
    </section>
  );
};
