'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { motion } from 'motion/react';
import { User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { useProfileData } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const HeaderNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: profileData, isError } = useProfileData();
  const { logout } = useAuth();

  if (isError) {
    toast({
      title: 'Error fetching profile data',
      description: 'Please try again later',
      variant: 'destructive',
    });
  }

  const navLinks = [
    { href: '/applicant/home', label: 'Home' },
    { href: '/applicant/applications', label: 'My Applications' },
    { href: '/applicant/documents', label: 'Services' },
    { href: '/applicant/support', label: 'Help & Support' },
    { href: '/applicant/profile', label: 'Profile' },
  ];

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: '-100%' },
  };

  const userName = profileData?.name;
  const userEmail = profileData?.email;

  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      <Container>
        <div className='flex items-center justify-between py-3'>
          {/* Logo - Left Section */}
          <motion.div
            className='flex-shrink-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href='/'>
              <div className='flex items-center'>
                {/* TODO: Add logo */}
                {/* <Image src='/src/' alt='PassGo Logo' width={40} height={40} className='mr-2' /> */}
                <span className='text-xl font-bold text-blue-600 hidden sm:inline-block'>
                  PassGo
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Nav Links - Middle Section (Hidden on Mobile) */}
          <nav className='hidden md:flex items-center justify-center flex-1 mx-10 space-x-6'>
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className='text-gray-700 hover:text-blue-600 transition-colors font-medium align-middle'
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* User Profile - Right Section */}
          <motion.div
            className='flex items-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Popover>
              <PopoverTrigger>
                <div className='hidden sm:flex items-center'>
                  <div className='mr-2 text-right'>
                    <p className='text-sm font-medium'>{userName || 'Applicant User'}</p>
                    <p className='text-xs text-gray-500'>{userEmail || 'applicant@example.com'}</p>
                  </div>
                  <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
                    <User size={20} />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-fit'>
                <Button
                  className='w-full flex items-center justify-center gap-2'
                  variant='destructive'
                  onClick={logout}
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </PopoverContent>
            </Popover>

            {/* Mobile Menu Button */}
            <div className='md:hidden ml-2 flex flex-row items-center justify-between'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsOpen(!isOpen)}
                aria-label='Toggle menu'
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Mobile Menu */}
      <motion.div
        className='md:hidden overflow-hidden'
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: 0, opacity: 0 },
        }}
        transition={{ duration: 0.3 }}
      >
        <Container className='px-10'>
          <div className='py-3 space-y-3'>
            {navLinks.map(link => (
              <motion.div
                key={link.href}
                variants={variants}
                className='border-b border-gray-200 py-2'
              >
                <Link
                  href={link.href}
                  className='block text-gray-700 hover:text-blue-600 transition-colors'
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div className='pt-4 flex flex-col gap-4'>
              <div className='flex items-center'>
                <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3'>
                  <User size={20} />
                </div>
                <div>
                  <p className='text-sm font-medium'>{userName}</p>
                  <p className='text-xs text-gray-500'>{userEmail}</p>
                </div>
              </div>
              <Button
                className='w-full flex items-center justify-center gap-2'
                variant='destructive'
                onClick={logout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </motion.div>
    </header>
  );
};

export default HeaderNavigation;
