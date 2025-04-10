'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { SignUpSchema } from '@/utils/validation/SignUpSchema';
import { SignUpFormValues } from '@/types/formTypes';

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      birthdate: '',
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
    // Handle form submission (API call, etc.)
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-[#3B82F6] md:bg-transparent'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Sign Up using Email</h2>
        <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
          <input
            placeholder='First Name'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='text'
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className='text-red-500 text-xs mb-3'>{errors.firstName.message}</p>
          )}

          <input
            placeholder='Last Name'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='text'
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className='text-red-500 text-xs mb-3'>{errors.lastName.message}</p>
          )}

          <input
            placeholder='Email'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='email'
            {...register('email')}
          />
          {errors.email && <p className='text-red-500 text-xs mb-3'>{errors.email.message}</p>}

          <input
            placeholder='Confirm Email'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='email'
            {...register('confirmEmail')}
          />
          {errors.confirmEmail && (
            <p className='text-red-500 text-xs mb-3'>{errors.confirmEmail.message}</p>
          )}

          {/* Password field with eye icon */}
          <div className='relative'>
            <input
              placeholder='Password'
              className='w-full bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
              type={showPassword ? 'text' : 'password'}
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

          {/* Confirm Password field with eye icon */}
          <div className='relative'>
            <input
              placeholder='Confirm Password'
              className='w-full bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className='text-red-500 text-xs mb-3'>{errors.confirmPassword.message}</p>
          )}

          <label className='text-sm mb-2 text-gray-900 cursor-pointer' htmlFor='gender'>
            Gender
          </label>
          <select
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            id='gender'
            {...register('gender')}
          >
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
          </select>
          {errors.gender && <p className='text-red-500 text-xs mb-3'>{errors.gender.message}</p>}

          <label className='text-sm mb-2 text-gray-900 cursor-pointer' htmlFor='birthdate'>
            Birth Date
          </label>
          <input
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1'
            id='birthdate'
            type='date'
            {...register('birthdate')}
          />
          {errors.birthdate && (
            <p className='text-red-500 text-xs mb-3'>{errors.birthdate.message}</p>
          )}

          <p className='text-gray-900 mt-4'>
            {' '}
            Already have an account?{' '}
            <a href='/login' className='text-sm text-blue-500 -200 hover:underline mt-4'>
              Login
            </a>
          </p>
          <Button variant={'default'} type='submit' className='py-2 px-4 mt-4'>
            Sign Up
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

export default SignUpForm;
