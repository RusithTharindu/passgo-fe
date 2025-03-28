'use client';
import SignUpForm from '@/components/molecules/SignUpForm/SignUpForm';
import { colors } from '@/config/colors';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div
      className='min-h-screen w-full flex flex-col md:flex-row relative'
      style={{ background: colors.background.secondary }}
    >
      {/* Back to Home Button - Absolute positioned */}
      <Button
        variant='ghost'
        className='absolute top-4 left-4 flex items-center gap-2 text-white'
        onClick={() => router.push('/')}
      >
        <ArrowLeft size={20} />
        Back to Home
      </Button>

      {/* Left Section - Brand/Welcome */}
      <div
        className='w-full hidden md:w-1/2 p-8 md:flex flex-col justify-center items-center'
        style={{ background: colors.primary.main }}
      >
        <div className='max-w-md text-center'>
          <h1
            className='text-4xl md:text-5xl font-bold mb-4'
            style={{ color: colors.background.primary }}
          >
            Join PassGo
          </h1>
          <h2
            className='text-2xl md:text-3xl font-semibold mb-6'
            style={{ color: colors.background.secondary }}
          >
            Begin Your Passport Journey
          </h2>
          <p className='text-lg md:text-xl mb-8' style={{ color: colors.background.secondary }}>
            Create your account to start your passport application process with ease
          </p>

          {/* Key Benefits List */}
          <div className='mt-8 space-y-4 text-left'>
            {[
              {
                title: 'Quick Registration',
                desc: 'Simple one-time registration process',
              },
              {
                title: 'Save & Continue',
                desc: 'Save your progress and complete application later',
              },
              {
                title: 'Document Guidelines',
                desc: 'Clear instructions for required documents',
              },
              {
                title: 'Application Support',
                desc: 'Get assistance throughout your application process',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className='flex items-start space-x-3 mb-4'
                style={{ color: colors.background.secondary }}
              >
                <div className='flex-shrink-0 mt-1'>
                  <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold'>{feature.title}</h3>
                  <p className='text-sm opacity-90'>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Information Badge */}
          <div className='mt-12 p-4 rounded-lg' style={{ background: `${colors.primary.dark}30` }}>
            <p className='text-sm' style={{ color: colors.background.secondary }}>
              Register now to apply for your Sri Lankan passport online
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Sign Up Form */}
      <div className='w-full md:w-1/2 md:p-8 flex justify-center items-center bg-white md:bg-transparent'>
        <div className='w-full'>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
