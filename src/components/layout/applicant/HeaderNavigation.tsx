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
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const HeaderNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: profileData, isError } = useProfileData();
  const { logout } = useAuth();
  const pathname = usePathname();

  if (isError) {
    toast({
      title: 'Error fetching profile data',
      description: 'Please try again later',
      variant: 'destructive',
    });
  }

  const navLinks = [
    { href: '/applicant/home', label: 'Home' },
    { href: '/applicant/myActivity', label: 'My Activity' },
    { href: '/applicant/documents', label: 'Services' },
    { href: '/applicant/support', label: 'Help & Support' },
  ];

  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: '-100%' },
  };

  const userName = profileData?.firstName + ' ' + profileData?.lastName;
  const userEmail = profileData?.email;

  return (
    <header className='sticky top-4 z-50 bg-transparent'>
      <Container>
        <div className='flex h-14 items-center gap-4 py-2'>
          {/* Left Section - Logo */}
          <div className='flex items-center w-[240px] flex-shrink-0 bg-white/5 hover:bg-white/10 rounded-full px-4 h-10 backdrop-blur-sm'>
            <Link href='/'>
              <div className='flex items-center'>
                {/* TODO: Add logo */}
                {/* <Image src='/src/' alt='PassGo Logo' width={40} height={40} className='mr-2' /> */}
                <span className='text-xl font-bold text-blue-600 hidden sm:inline-block'>
                  PassGo
                </span>
              </div>
            </Link>
          </div>

          {/* Middle Section - Navigation */}
          <div className='flex-1 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full px-2 h-10 backdrop-blur-sm'>
            <nav className='hidden md:flex items-center space-x-1'>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium text-gray-700 rounded-full transition-all',
                    pathname === link.href
                      ? 'bg-white/80 text-gray-900 shadow-[0_2px_8px_rgb(0,0,0,0.1)]'
                      : 'hover:bg-white/40',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section - User Profile */}
          <div className='w-[280px] flex items-center justify-end'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-full h-10 px-4 backdrop-blur-sm'
                >
                  <div className='flex items-center'>
                    <div className='mr-2 text-right'>
                      <p className='text-sm font-medium text-gray-700'>
                        {userName || 'Applicant User'}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {userEmail || 'applicant@example.com'}
                      </p>
                    </div>
                    <div className='h-7 w-7 rounded-full bg-white/80 shadow-[0_2px_8px_rgb(0,0,0,0.1)] flex items-center justify-center text-blue-600'>
                      <User size={15} />
                    </div>
                  </div>
                </Button>
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
            <div className='md:hidden'>
              <Button
                variant='ghost'
                size='icon'
                className='bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm'
                onClick={() => setIsOpen(!isOpen)}
                aria-label='Toggle menu'
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
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
            {[...navLinks, { href: '/applicant/profile', label: 'Profile' }].map(link => (
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
