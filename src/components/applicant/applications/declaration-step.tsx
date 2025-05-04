'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { applicationSchema } from '@/types/application';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

type FormData = z.infer<typeof applicationSchema>;

interface DeclarationStepProps {
  form: UseFormReturn<FormData>;
}

export function DeclarationStep({ form }: DeclarationStepProps) {
  return (
    <div className='space-y-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Declaration</h2>
        <p className='text-muted-foreground'>
          Please read and agree to the declaration before submitting your application
        </p>
      </div>

      <Card>
        <CardContent className='p-6'>
          <div className='prose prose-sm max-w-none'>
            <h3>Passport Application Declaration</h3>
            <p>I, the undersigned, hereby declare that:</p>
            <ol className='list-decimal list-outside pl-5 space-y-2'>
              <li>I am a citizen of Sri Lanka by birth/descent/registration.</li>
              <li>
                The information provided in this application is true and correct to the best of my
                knowledge and belief.
              </li>
              <li>I have not renounced or been deprived of Sri Lankan citizenship.</li>
              <li>
                The documents attached to this application are genuine and have been obtained
                legally.
              </li>
              <li>
                I understand that providing false information or fraudulent documents is an offense
                punishable by law.
              </li>
              <li>
                I am aware that my application may be rejected or my passport may be canceled if any
                information is found to be incorrect.
              </li>
              <li>
                I am aware that the passport remains the property of the Government of Sri Lanka and
                can be withdrawn at any time.
              </li>
            </ol>

            <p className='mt-4'>
              I further authorize the Department of Immigration and Emigration of Sri Lanka to
              verify any information provided in this application.
            </p>
          </div>

          <div className='mt-6'>
            <FormField
              control={form.control}
              name='declaration'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      I hereby declare that I have read and understood the above declaration and
                      agree to its terms
                    </FormLabel>
                    <p className='text-sm text-muted-foreground'>
                      By checking this box, you are signing this declaration electronically
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
