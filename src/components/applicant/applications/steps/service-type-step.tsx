'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';

type FormData = z.infer<typeof applicationSchema>;

export default function ServiceTypeStep() {
  const { control } = useFormContext<FormData>();

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Select Service Type</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name='typeOfService'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel>Please select the type of service you require:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className='flex flex-col space-y-1'
                  >
                    <FormItem className='flex items-center space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <RadioGroupItem value='normal' />
                      </FormControl>
                      <div className='space-y-1'>
                        <FormLabel className='font-medium'>Normal Service</FormLabel>
                        <p className='text-sm text-muted-foreground'>
                          Standard processing time (approximately 2-3 weeks)
                        </p>
                      </div>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <RadioGroupItem value='oneDay' />
                      </FormControl>
                      <div className='space-y-1'>
                        <FormLabel className='font-medium'>One Day Service</FormLabel>
                        <p className='text-sm text-muted-foreground'>
                          Express processing (passport ready within 1 business day)
                        </p>
                      </div>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
