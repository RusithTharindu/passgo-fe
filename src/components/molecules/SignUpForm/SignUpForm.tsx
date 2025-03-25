import { Button } from '@/components/ui/button';
import React from 'react';

const Form = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Sign Up</h2>
        <form className='flex flex-col'>
          <input
            placeholder='First Name'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='text'
          />
          <input
            placeholder='Last Name'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='text'
          />
          <input
            placeholder='Email'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='email'
          />
          <input
            placeholder='Confirm Email'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='email'
          />
          <input
            placeholder='Password'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='password'
          />
          <input
            placeholder='Confirm Password'
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            type='password'
          />
          <label className='text-sm mb-2 text-gray-900 cursor-pointer' htmlFor='gender'>
            Gender
          </label>
          <select
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            id='gender'
          >
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
          </select>
          <label className='text-sm mb-2 text-gray-900 cursor-pointer' htmlFor='age'>
            Age
          </label>
          <input
            className='bg-gray-100 text-gray-900 border-0 rounded-md p-2'
            id='age'
            type='date'
          />
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
          <Button variant={'outline'} type='reset' className='py-2 px-4 mt-4'>
            Clear Form
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Form;
