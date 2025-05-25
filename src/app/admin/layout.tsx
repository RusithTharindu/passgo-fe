'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/useProfile';
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Calendar,
  RefreshCw,
  User,
  Moon,
  Sun,
  ChevronsLeftRightEllipsis,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '../../../public/assets/logo/passgo-logo.png';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const { data: profileData, isError } = useProfileData();
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if user has theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

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
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Passport Applications',
      href: '/admin/applications',
      icon: FileText,
    },
    {
      title: 'Requested Appointments',
      href: '/admin/appointments',
      icon: Calendar,
    },
    {
      title: 'Passport Renewals',
      href: '/admin/renewals',
      icon: RefreshCw,
    },
    {
      title: 'Document Validator',
      href: '/admin/document-ai',
      icon: ChevronsLeftRightEllipsis,
    },
  ];

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Sidebar */}
      <div className='flex h-full w-64 flex-col bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
        {/* Logo Section */}
        <Link
          href='/'
          className='flex items-center gap-2 px-6 py-4 border-b border-gray-200 dark:border-gray-700'
        >
          <Image src={logo} alt='PassGo Logo' width={32} height={32} />
          <span className='text-xl font-bold text-gray-900 dark:text-white'>PassGo</span>
        </Link>

        {/* Navigation Links */}
        <nav className='flex-1 space-y-1 px-3 py-4'>
          {navItems.map(({ title, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon
                  className={`mr-3 h-4 w-4 ${isActive ? 'text-blue-700 dark:text-blue-200' : 'text-gray-400 dark:text-gray-400'}`}
                />
                {title}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className='border-t border-gray-200 p-4 dark:border-gray-700'>
          <div className='mb-2 flex items-center'>
            <User className='mr-2 h-4 w-4 text-gray-400 dark:text-gray-400' />
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-white'>{userName}</p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>{userEmail}</p>
            </div>
          </div>
          <div className='space-y-2'>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <>
                  <Moon className='mr-2 h-4 w-4' />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className='mr-2 h-4 w-4' />
                  Light Mode
                </>
              )}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
              onClick={() => logout()}
            >
              <LogOut className='mr-2 h-4 w-4' />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto bg-white dark:bg-gray-900'>
        <main className='h-full p-6'>{children}</main>
      </div>
    </div>
  );
}
