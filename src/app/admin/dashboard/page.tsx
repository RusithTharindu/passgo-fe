'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DailyApplicationData {
  date: string;
  applications: number;
}

interface DistrictData {
  district: string;
  applications: number;
}

interface PassportTypeData {
  name: string;
  value: number;
}

// Sample data - Replace with actual API data
const dailyApplicationData: DailyApplicationData[] = [
  { date: '2024-01-01', applications: 45 },
  { date: '2024-01-02', applications: 52 },
  { date: '2024-01-03', applications: 49 },
  { date: '2024-01-04', applications: 63 },
  { date: '2024-01-05', applications: 58 },
  { date: '2024-01-06', applications: 48 },
  { date: '2024-01-07', applications: 55 },
];

const districtData: DistrictData[] = [
  { district: 'Colombo', applications: 150 },
  { district: 'Gampaha', applications: 120 },
  { district: 'Kalutara', applications: 90 },
  { district: 'Kandy', applications: 85 },
  { district: 'Galle', applications: 75 },
  { district: 'Matara', applications: 70 },
];

const passportTypeData: PassportTypeData[] = [
  { name: 'Normal', value: 60 },
  { name: 'One Day', value: 25 },
  { name: 'Business', value: 15 },
];

export default function DashboardPage() {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Dashboard Analytics</h1>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Daily Application Rate */}
        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle className='dark:text-white'>Daily Application Rate</CardTitle>
            <CardDescription className='dark:text-gray-400'>
              Number of applications per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300}>
              <LineChart data={dailyApplicationData}>
                <XAxis
                  dataKey='date'
                  tickFormatter={(value: string) => new Date(value).toLocaleDateString()}
                  stroke='currentColor'
                  className='dark:text-gray-400'
                />
                <YAxis stroke='currentColor' className='dark:text-gray-400' />
                <Tooltip
                  labelFormatter={(value: string) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value} applications`]}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Line
                  type='monotone'
                  dataKey='applications'
                  stroke='#2563eb'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* District Based Applications */}
        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle className='dark:text-white'>Applications by District</CardTitle>
            <CardDescription className='dark:text-gray-400'>
              Distribution across districts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300}>
              <BarChart data={districtData}>
                <XAxis dataKey='district' stroke='currentColor' className='dark:text-gray-400' />
                <YAxis stroke='currentColor' className='dark:text-gray-400' />
                <Tooltip
                  formatter={(value: number) => [`${value} applications`]}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey='applications' fill='#3b82f6' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Passport Type Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className='dark:text-white'>Passport Types</CardTitle>
            <CardDescription className='dark:text-gray-400'>
              Distribution by service type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer height={300}>
              <PieChart>
                <Pie
                  data={passportTypeData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  fill='#3b82f6'
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
