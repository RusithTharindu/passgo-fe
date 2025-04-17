'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/useProfile';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const { data: profileData, isError } = useProfileData();

  const userName = profileData?.firstName + ' ' + profileData?.lastName;
  const userEmail = profileData?.email;

  if (isError) {
    toast({
      title: 'Error fetching profile data',
      description: 'Please try again later',
      variant: 'destructive',
    });
  }

  const navItems = [
    {
      title: 'Passport Applications',
      href: '/admin/applications',
    },
    {
      title: 'Requested Appointments',
      href: '/admin/appointments',
    },
    {
      title: 'Passport Renewals',
      href: '/admin/renewals',
    },
  ];

  return (
    <div className='flex h-screen bg-gray-950'>
      {/* Sidebar */}
      <div className='flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800'>
        {/* Logo Section */}
        <div className='flex items-center gap-2 px-6 py-4 border-b border-gray-800'>
          <div className='h-8 w-8 rounded-full bg-blue-500' />
          <span className='text-xl font-bold text-white'>PassGo</span>
        </div>

        {/* Navigation Links */}
        <nav className='flex-1 space-y-1 px-3 py-4'>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className='flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className='border-t border-gray-800 p-4'>
          <div className='mb-2'>
            <p className='text-sm font-medium text-gray-200'>{userName}</p>
            <p className='text-xs text-gray-400'>{userEmail}</p>
          </div>
          <Button
            variant='ghost'
            className='w-full justify-start text-red-400 hover:text-red-500 hover:bg-gray-800'
            onClick={() => logout()}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto bg-gray-900'>
        <main className='h-full p-6 text-gray-100'>{children}</main>
      </div>
    </div>
  );
}
