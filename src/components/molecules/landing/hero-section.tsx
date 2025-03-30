'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { GovernmentLogo } from './government-logo';
import Cookies from 'js-cookie';
import { decode, JwtPayload } from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const router = useRouter();
  const onClick = () => {
    const accessToken = Cookies.get('token');
    if (accessToken) {
      const decodedToken = decode(accessToken) as JwtPayload;
      const role = decodedToken.role;
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'applicant') {
        router.push('/applicant/dashboard');
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <section className='bg-[#112e51] py-8 md:py-12 lg:py-16 text-white'>
      <div className='container px-4 md:px-6 mx-auto max-w-6xl'>
        <div className='flex flex-col items-center text-center mb-6'>
          <GovernmentLogo />
        </div>
        <div className='grid gap-6 lg:grid-cols-2 lg:gap-12'>
          <div className='flex flex-col justify-center space-y-4 text-center lg:text-left'>
            <div className='space-y-2 mx-auto lg:mx-0 max-w-xl'>
              <h2 className='text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl'>
                Sri Lanka Passport Application Portal
              </h2>
              <p className='text-white/80 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed'>
                Apply for, renew, or check the status of your Sri Lankan passport through our secure
                online portal.
              </p>
            </div>
            <div className='flex flex-col gap-2 sm:flex-row justify-center lg:justify-start'>
              {/* <Link href={'/login'} > */}
              <Button className='bg-white text-[#112e51] hover:bg-white/90' onClick={onClick}>
                Start Application
              </Button>
              {/* </Link> */}
              <Button
                variant='outline'
                className='border-white text-white hover:bg-white/10 bg-transparent'
              >
                Check Status
              </Button>
            </div>
          </div>
          <div className='flex items-center justify-center mt-6 lg:mt-0'>
            <Image
              src='/favicon.ico'
              width={1000}
              height={400}
              alt=''
              objectFit='cover'
              className='rounded-lg w-full max-w-md mx-auto'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
