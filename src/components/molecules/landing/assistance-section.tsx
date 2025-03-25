import { Button } from '@/components/ui/button';
import { HelpCircle, MapPin } from 'lucide-react';

export function AssistanceSection() {
  return (
    <section className='py-10 md:py-14 lg:py-20'>
      <div className='container px-4 md:px-6 mx-auto max-w-6xl'>
        <div className='grid gap-8 md:gap-12 lg:grid-cols-2'>
          <div className='flex flex-col justify-center space-y-4 mx-auto max-w-xl'>
            <div className='space-y-2 text-center lg:text-left'>
              <h2 className='text-2xl font-bold tracking-tighter text-[#112e51] sm:text-3xl md:text-4xl'>
                Need Assistance?
              </h2>
              <p className='text-gray-600 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed'>
                Our customer service representatives are available to help with your passport
                application.
              </p>
            </div>
            <div className='space-y-4'>
              <div className='flex items-start gap-4'>
                <HelpCircle className='h-6 w-6 text-[#0071bc]' />
                <div>
                  <h3 className='font-bold text-[#112e51]'>Frequently Asked Questions</h3>
                  <p className='text-sm text-gray-600'>
                    Find answers to common questions about passport applications.
                  </p>
                  <Button variant='link' className='mt-1 p-0 text-[#0071bc]'>
                    View FAQs
                  </Button>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <MapPin className='h-6 w-6 text-[#0071bc]' />
                <div>
                  <h3 className='font-bold text-[#112e51]'>Passport Acceptance Facilities</h3>
                  <p className='text-sm text-gray-600'>
                    Find the nearest location to submit your application in person.
                  </p>
                  <Button variant='link' className='mt-1 p-0 text-[#0071bc]'>
                    Find Locations
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col space-y-4 rounded-lg border-2 border-[#dcdcdc] p-6 mt-6 lg:mt-0 mx-auto w-full max-w-xl'>
            <h3 className='text-xl font-bold text-[#112e51] text-center lg:text-left'>
              Contact Information
            </h3>
            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-900'>
                Department of Immigration and Emigration, Sri Lanka
              </p>
              <p className='text-sm font-medium text-gray-900'>
                Suhurupaya, Sri Subhuthipura Road,
                <br /> Battaramulla.
              </p>
              <br />
              <p className='text-sm text-gray-600'>Hotline: 1962</p>
              <p className='text-sm text-gray-600'>Phone: +94 112 101 500</p>
              <p className='text-sm text-gray-600'>Email: controller@Immigration.gov.lk</p>
              <br />
              <h3 className='text-xl font-bold text-[#112e51] text-center lg:text-left'>
                Operating Hours
              </h3>
              <p className='text-sm text-gray-600'>Monday-Friday: 8:30 AM - 4:15 PM</p>
              <p className='text-sm text-gray-600'>Saturday and Sunday: Closed</p>
            </div>
            <div className='pt-4'>
              <Button className='w-full bg-[#0071bc] hover:bg-[#205493] text-white'>
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
