'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { LoginSchema } from '@/utils/validation/LoginSchema';
import { LoginFormValues } from '@/types/formTypes';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { decode, JwtPayload } from 'jsonwebtoken';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: login, isPending, isError, error } = useLogin();

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Call login mutation with form data
    login(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          const accessToken = Cookies.get('token');
          if (accessToken) {
            const decodedToken = decode(accessToken) as JwtPayload;
            const role = decodedToken.role;
            if (role === 'admin') {
              router.push('/admin/dashboard');
            } else if (role === 'applicant') {
              router.push('/applicant/home');
            } else {
              router.push('/');
            }
          }
        },
      },
    );
  };

  return (
    <div className='w-full max-h-screen flex flex-col items-center justify-center h-screen bg-[#3B82F6] md:bg-transparent'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Login with your PassGo Account</h2>

        {/* Display error message if login failed */}
        {isError && (
          <div className='p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50'>
            {error instanceof Error ? error.message : 'Login failed. Please try again.'}
          </div>
        )}

        <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <input
            type='email'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            placeholder='Email address'
            {...register('email')}
          />
          {errors.email && <p className='text-red-500 text-xs mb-3'>{errors.email.message}</p>}

          {/* Password field with eye icon */}
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='w-full bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
              placeholder='Password'
              {...register('password')}
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className='text-red-500 text-xs mb-3'>{errors.password.message}</p>
          )}

          <div className='flex items-center justify-between flex-wrap'>
            <label htmlFor='remember-me' className='text-sm text-gray-900 cursor-pointer'>
              <input
                type='checkbox'
                id='remember-me'
                className='mr-2'
                // {...register('rememberMe')}
              />
              Remember me
            </label>
            <a href='#' className='text-sm text-blue-500 hover:underline mb-0.5'>
              Forgot password?
            </a>
            <p className='text-gray-900 mt-4'>
              {' '}
              Don&apos;t have an account?{' '}
              <a href='/signup' className='text-sm text-blue-500 -200 hover:underline mt-4'>
                Signup
              </a>
            </p>
          </div>
          <Button variant={'default'} type='submit' className='py-2 px-4 mt-4' disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            variant={'outline'}
            type='button'
            className='py-2 px-4 mt-4'
            onClick={() => reset()}
            disabled={isPending}
          >
            Clear Form
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
