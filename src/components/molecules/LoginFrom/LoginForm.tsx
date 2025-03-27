'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

// Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

// Type for our form values
type LoginFormValues = z.infer<typeof loginSchema>;

const Form = () => {
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
    // Handle form submission (API call, etc.)
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Login</h2>
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
                {...register('rememberMe')}
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
          <Button variant={'default'} type='submit' className='py-2 px-4 mt-4'>
            Login
          </Button>
          <Button
            variant={'outline'}
            type='button'
            className='py-2 px-4 mt-4'
            onClick={() => reset()}
          >
            Clear Form
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Form;
