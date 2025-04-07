'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';

export default function ApplicantDashboard() {
  return (
    <Container>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>2</div>
              <p className='text-xs text-muted-foreground'>1 pending, 1 approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>7</div>
              <p className='text-xs text-muted-foreground'>2 pending verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>3</div>
              <p className='text-xs text-muted-foreground'>1 unread message</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>80%</div>
              <p className='text-xs text-muted-foreground'>Profile completion</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-4'>
                <li className='flex items-center'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full mr-2'></div>
                  <div>
                    <p className='text-sm font-medium'>Application submitted</p>
                    <p className='text-xs text-gray-500'>2 days ago</p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                  <div>
                    <p className='text-sm font-medium'>Document verified</p>
                    <p className='text-xs text-gray-500'>3 days ago</p>
                  </div>
                </li>
                <li className='flex items-center'>
                  <div className='w-2 h-2 bg-yellow-500 rounded-full mr-2'></div>
                  <div>
                    <p className='text-sm font-medium'>Message received</p>
                    <p className='text-xs text-gray-500'>5 days ago</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-4'>
                <li className='flex items-center'>
                  <div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2'>
                    1
                  </div>
                  <p className='text-sm'>Complete identity verification</p>
                </li>
                <li className='flex items-center'>
                  <div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2'>
                    2
                  </div>
                  <p className='text-sm'>Upload remaining documents</p>
                </li>
                <li className='flex items-center'>
                  <div className='w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2'>
                    3
                  </div>
                  <p className='text-sm'>Schedule appointment</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
