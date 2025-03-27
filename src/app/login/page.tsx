'use client';
import LoginForm from '@/components/molecules/LoginForm/LoginForm';
import { colors } from '@/common/config/colors';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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
        className='w-full hidden md:w-1/2 p-8 md:flex flex-col justify-center items-center rounded-r-2xl'
        style={{ background: colors.primary.main }}
      >
        <div className='max-w-md text-center'>
          <h1
            className='text-4xl md:text-5xl font-bold mb-4'
            style={{ color: colors.background.primary }}
          >
            Welcome to PassGo
          </h1>
          <h2
            className='text-2xl md:text-3xl font-semibold mb-6'
            style={{ color: colors.background.secondary }}
          >
            Sri Lankan Passport Services
          </h2>
          <p className='text-lg md:text-xl mb-8' style={{ color: colors.background.secondary }}>
            Your simplified gateway to passport application processing and validation
          </p>

          {/* Key Features List */}
          <div className='mt-8 space-y-4 text-left'>
            {[
              {
                title: 'Easy Application Process',
                desc: 'Submit and track your passport application online',
              },
              {
                title: 'Document Validation',
                desc: 'Instant verification of your application documents',
              },
              {
                title: 'Application Status',
                desc: 'Real-time updates on your passport application',
              },
              {
                title: 'Secure Processing',
                desc: 'Government-approved secure application handling',
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
          <div className='mt-12 p-4 rounded-lg' style={{ background: `${colors.primary.dark}30` }}>
            <p className='text-sm' style={{ color: colors.background.secondary }}>
              Online platform for Sri Lankan passport applications
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className='w-full md:w-1/2 md:p-8 flex justify-center items-center bg-white md:bg-transparent'>
        <div className='w-full'>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
