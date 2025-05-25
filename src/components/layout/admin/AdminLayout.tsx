'use client';

import React, { ReactNode } from 'react';
import { Container } from '@/components/ui/container';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Layout component for admin pages
 * Includes header navigation and wraps content in a container
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <header className='sticky top-0 z-50 bg-white shadow-sm'>
        <Container>
          <div className='flex h-16 items-center justify-between py-4'>
            <div className='flex items-center gap-4'>
              <Link className='flex items-center gap-2 font-semibold' href='/admin/dashboard'>
                <span className='text-xl font-bold'>PassGo Admin</span>
              </Link>
            </div>
            <nav className='hidden md:flex items-center gap-6'>
              <Link className='text-sm font-medium hover:text-blue-600' href='/admin/dashboard'>
                Dashboard
              </Link>
              <Link className='text-sm font-medium hover:text-blue-600' href='/admin/applications'>
                Applications
              </Link>
              <Link className='text-sm font-medium hover:text-blue-600' href='/admin/document-ai'>
                Document AI
              </Link>
              <Link className='text-sm font-medium hover:text-blue-600' href='/admin/users'>
                Users
              </Link>
              <Link className='text-sm font-medium hover:text-blue-600' href='/admin/reports'>
                Reports
              </Link>
              <Link className='text-sm font-medium hover:text-blue-600' href='/admin/settings'>
                Settings
              </Link>
            </nav>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Admin User</span>
                <div className='h-9 w-9 rounded-full bg-primary-50 flex items-center justify-center'>
                  <span className='text-xs font-medium text-blue-600'>AU</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <main className='flex-grow py-6'>
        <Container>{children}</Container>
      </main>

      <footer className='py-6 bg-white border-t'>
        <Container>
          <div className='text-center text-sm text-gray-500'>
            <p>&copy; {new Date().getFullYear()} PassGo Admin Portal. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
