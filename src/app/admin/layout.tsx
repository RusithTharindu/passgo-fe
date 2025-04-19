'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/useProfile';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const { data: profileData, isError } = useProfileData();
  const pathname = usePathname();

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
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className='flex h-full w-64 flex-col bg-white border-r border-gray-200'>
        {/* Logo Section */}
        <div className='flex items-center gap-2 px-6 py-4 border-b border-gray-200'>
          <div className='h-8 w-8 rounded-full bg-blue-500' />
          <span className='text-xl font-bold text-gray-900'>PassGo</span>
        </div>

        {/* Navigation Links */}
        <nav className='flex-1 space-y-1 px-3 py-4'>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className='border-t border-gray-200 p-4'>
          <div className='mb-2'>
            <p className='text-sm font-medium text-gray-900'>{userName}</p>
            <p className='text-xs text-gray-500'>{userEmail}</p>
          </div>
          <Button
            variant='ghost'
            className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-gray-100'
            onClick={() => logout()}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto bg-white'>
        <main className='h-full p-6'>{children}</main>
      </div>
    </div>
  );
}
