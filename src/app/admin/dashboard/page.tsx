'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  useGetDistrictDistribution,
  useGetDailyDistribution,
  useGetPassportTypesData,
} from '@/hooks/useApplication';
import { Skeleton } from '@/components/ui/skeleton';

const passportTypes = [
  { name: 'Regular (36 Pages)', value: 450 },
  { name: 'Regular (60 Pages)', value: 180 },
  { name: 'Business', value: 120 },
  { name: 'Official', value: 50 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function AdminDashboard() {
  const { data: districtDistribution, isLoading: isDistrictLoading } = useGetDistrictDistribution();
  const { data: dailyDistribution, isLoading: isDailyLoading } = useGetDailyDistribution();
  const { data: passportTypesData, isLoading: isPassportTypesLoading } = useGetPassportTypesData();

  const isLoading = isDistrictLoading || isDailyLoading || isPassportTypesLoading;

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Passport Application Data Analytics</h1>
      </div>

      {isLoading ? (
        <div className='space-y-8'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <Skeleton className='h-6 w-1/3' />
              </CardHeader>
              <CardContent className='pl-2'>
                <Skeleton className='h-[350px] w-full' />
              </CardContent>
            </Card>
            <Card className='col-span-3'>
              <CardHeader>
                <Skeleton className='h-6 w-1/3' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-[350px] w-full' />
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <Skeleton className='h-6 w-1/3' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-[350px] w-full' />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Daily Applications</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <ResponsiveContainer width='100%' height={350}>
                  <LineChart data={dailyDistribution}>
                    <XAxis
                      dataKey='date'
                      stroke='#888888'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke='#888888'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={value => `${value}`}
                    />
                    <Tooltip />
                    <Line dataKey='applications' stroke='#0ea5e9' strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className='col-span-3'>
              <CardHeader>
                <CardTitle>Applications by District</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={350}>
                  <BarChart data={districtDistribution} layout='vertical'>
                    <XAxis type='number' />
                    <YAxis dataKey='name' type='category' width={100} />
                    <Tooltip />
                    <Bar dataKey='value' fill='#0ea5e9' radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Passport Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={350}>
                  <PieChart>
                    <Pie
                      data={passportTypesData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={130}
                      fill='#8884d8'
                      dataKey='value'
                    >
                      {passportTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
