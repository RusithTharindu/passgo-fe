import { WorldMap } from '@/components/ui/world-map';
import React from 'react';

const WorldwideSection = () => {
  return (
    <section className='py-10 md:py-14 lg:py-15'>
      <div className='container px-4 md:px-6 mx-auto max-w-6xl'>
        {/* <div className='grid gap-8 md:gap-12 lg:grid-cols-2'> */}
        <div className='flex flex-col justify-center space-y-4 mx-auto max-w-xl'>
          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-bold tracking-tighter text-[#112e51] sm:text-3xl md:text-4xl'>
              Travel around the world with ease
            </h2>
            <p className='text-gray-600 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed'>
              Get your passport application processed in just a few clicks.
            </p>
          </div>
        </div>
        <div className='flex flex-col space-y-4 rounded-lg p-6 mt-6 lg:mt-0 mx-auto w-full'>
          <WorldMap
            dots={[
              {
                start: {
                  lat: 64.2008,
                  lng: -149.4937,
                }, // Alaska (Fairbanks)
                end: {
                  lat: 34.0522,
                  lng: -118.2437,
                }, // Los Angeles
              },
              {
                start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              },
              {
                start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
              },
              {
                start: { lat: 51.5074, lng: -0.1278 }, // London
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
              },
              // Add Sri Lanka and connections
              {
                start: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka (Colombo)
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 6.9271, lng: 79.8612 }, // Sri Lanka (Colombo)
                end: { lat: 3.139, lng: 101.6869 }, // Malaysia (Kuala Lumpur)
              },
              {
                start: { lat: 6.9271, lng: 79.8612 }, // Sri Lanka (Colombo)
                end: { lat: 1.3521, lng: 103.8198 }, // Singapore
              },
              {
                start: { lat: 6.9271, lng: 79.8612 }, // Sri Lanka (Colombo)
                end: { lat: 25.2048, lng: 55.2708 }, // Dubai
              },

              // Other new countries and connections
              {
                start: { lat: 35.6762, lng: 139.6503 }, // Japan (Tokyo)
                end: { lat: 1.3521, lng: 103.8198 }, // Singapore
              },
              {
                start: { lat: 35.6762, lng: 139.6503 }, // Japan (Tokyo)
                end: { lat: -33.8688, lng: 151.2093 }, // Australia (Sydney)
              },
              {
                start: { lat: -33.8688, lng: 151.2093 }, // Australia (Sydney)
                end: { lat: -36.8485, lng: 174.7633 }, // New Zealand (Auckland)
              },
              {
                start: { lat: 25.2048, lng: 55.2708 }, // Dubai
                end: { lat: 51.5074, lng: -0.1278 }, // London
              },
              {
                start: { lat: 25.2048, lng: 55.2708 }, // Dubai
                end: { lat: -33.9249, lng: 18.4241 }, // South Africa (Cape Town)
              },
              {
                start: { lat: 55.7558, lng: 37.6173 }, // Russia (Moscow)
                end: { lat: 51.5074, lng: -0.1278 }, // London
              },
              {
                start: { lat: 31.2304, lng: 121.4737 }, // China (Shanghai)
                end: { lat: 35.6762, lng: 139.6503 }, // Japan (Tokyo)
              },
            ]}
          />
        </div>
        {/* </div> */}
      </div>
    </section>
  );
};

export default WorldwideSection;

{
  /* <WorldMap
            dots={[
            {
                start: {
                lat: 64.2008,
                lng: -149.4937,
                }, // Alaska (Fairbanks)
                end: {
                lat: 34.0522,
                lng: -118.2437,
                }, // Los Angeles
            },
            {
                start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            },
            {
                start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            },
            {
                start: { lat: 51.5074, lng: -0.1278 }, // London
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
            },
            {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
            },
            {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
            ]}
        /> */
}
