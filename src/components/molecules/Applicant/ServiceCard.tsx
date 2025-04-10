import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceCardType } from '@/types/commonTypes';

const ServiceCard = ({
  id,
  title,
  description,
  image,
  link,
  imagePosition,
  linkText,
}: ServiceCardType) => {
  return (
    <div key={id} className='flex flex-col md:flex-row items-center gap-8 group'>
      {imagePosition === 'left' ? (
        <>
          <div className='w-full md:w-1/2 flex-col-reverse md:flex-row'>
            <div className='relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-all duration-300'>
              <Image
                src={image}
                alt={title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>
          </div>
          <div className='w-full md:w-1/2'>
            <Card className='border-0 shadow-none'>
              <CardContent className='p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#3B82F6]'>
                  {title}
                </h2>
                <p className='text-gray-600 mb-6'>{description}</p>
                <Button asChild>
                  <Link href={link}>{linkText}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className='w-full md:w-1/2'>
            <Card className='border-0 shadow-none'>
              <CardContent className='p-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#3B82F6]'>
                  {title}
                </h2>
                <p className='text-gray-600 mb-6'>{description}</p>
                <Button asChild>
                  <Link href={link}>{linkText}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className='w-full md:w-1/2'>
            <div className='relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-all duration-300'>
              <Image
                src={image}
                alt={title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceCard;
