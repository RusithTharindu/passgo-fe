'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { ApplicationFormData } from '../passport-application-form';

export default function TravelDocumentStep() {
  const { control } = useFormContext<ApplicationFormData>();

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Travel Document Type</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name='TypeofTravelDocument'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel>Please select the type of travel document:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className='flex flex-col space-y-1'
                  >
                    <FormItem className='flex items-center space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <RadioGroupItem value='all' />
                      </FormControl>
                      <div className='space-y-1'>
                        <FormLabel className='font-medium'>All Countries</FormLabel>
                        <p className='text-sm text-muted-foreground'>
                          Standard passport valid for all countries
                        </p>
                      </div>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <RadioGroupItem value='middleEast' />
                      </FormControl>
                      <div className='space-y-1'>
                        <FormLabel className='font-medium'>Middle East</FormLabel>
                        <p className='text-sm text-muted-foreground'>
                          Passport valid specifically for Middle Eastern countries
                        </p>
                      </div>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <RadioGroupItem value='emergencyCertificate' />
                      </FormControl>
                      <div className='space-y-1'>
                        <FormLabel className='font-medium'>Emergency Certificate</FormLabel>
                        <p className='text-sm text-muted-foreground'>
                          For emergency travel purposes
                        </p>
                      </div>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <RadioGroupItem value='identityCertificate' />
                      </FormControl>
                      <div className='space-y-1'>
                        <FormLabel className='font-medium'>Identity Certificate</FormLabel>
                        <p className='text-sm text-muted-foreground'>
                          Identity certificate for specific travel purposes
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

      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Existing Document Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={control}
              name='presentTravelDocument'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Present Travel Document Number (if any)</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter document number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='nmrpNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NMRP Number (if any)</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter NMRP number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
