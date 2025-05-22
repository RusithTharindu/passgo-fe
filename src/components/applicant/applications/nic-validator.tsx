'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

// NIC validation utility
const nicUtils = {
  // Months data for calculating birthdate
  months: [
    { month: 'January', days: 31 },
    { month: 'February', days: 29 },
    { month: 'March', days: 31 },
    { month: 'April', days: 30 },
    { month: 'May', days: 31 },
    { month: 'June', days: 30 },
    { month: 'July', days: 31 },
    { month: 'August', days: 31 },
    { month: 'September', days: 30 },
    { month: 'October', days: 31 },
    { month: 'November', days: 30 },
    { month: 'December', days: 31 },
  ],

  // Validate NIC
  isValidNIC: (nicNumber: string): boolean => {
    if (
      nicNumber.length === 10 &&
      !isNaN(Number(nicNumber.substr(0, 9))) &&
      isNaN(Number(nicNumber.substr(9, 1).toLowerCase())) &&
      ['x', 'v'].includes(nicNumber.substr(9, 1).toLowerCase())
    ) {
      return true;
    } else if (nicNumber.length === 12 && !isNaN(Number(nicNumber))) {
      return true;
    }
    return false;
  },

  // Extract data from NIC
  extractData: (nicNumber: string) => {
    let year = '';
    let dayList = '';
    let character = '';

    if (nicNumber.length === 10) {
      year = '19' + nicNumber.substr(0, 2);
      dayList = nicNumber.substr(2, 3);
      character = nicNumber.substr(9, 1);
    } else if (nicNumber.length === 12) {
      year = nicNumber.substr(0, 4);
      dayList = nicNumber.substr(4, 3);
      character = '';
    }

    return {
      year,
      dayList: parseInt(dayList),
      character,
    };
  },

  // Find day, month and gender
  findDayAndGender: (days: number, monthsArray: typeof nicUtils.months) => {
    let dayList = days;
    const result = { day: 0, month: '', gender: '' };

    if (dayList < 500) {
      result.gender = 'male';
    } else {
      result.gender = 'female';
      dayList = dayList - 500;
    }

    for (let i = 0; i < monthsArray.length; i++) {
      if (monthsArray[i].days < dayList) {
        dayList = dayList - monthsArray[i].days;
      } else {
        result.month = monthsArray[i].month;
        break;
      }
    }

    result.day = dayList;
    return result;
  },

  // Extract all information from NIC
  extractInfoFromNIC: (nicNumber: string) => {
    if (!nicUtils.isValidNIC(nicNumber)) {
      throw new Error('Invalid NIC number');
    }

    const extractedData = nicUtils.extractData(nicNumber);
    const findedData = nicUtils.findDayAndGender(extractedData.dayList, nicUtils.months);

    const month = findedData.month;
    const year = extractedData.year;
    const day = findedData.day;
    const gender = findedData.gender.toUpperCase();

    // Convert to month number (January = 0)
    const monthIndex = nicUtils.months.findIndex(m => m.month === month);

    // Create date object
    const dateOfBirth = new Date(Number(year), monthIndex, day);

    return {
      gender,
      dateOfBirth,
    };
  },
};

interface NICValidatorProps {
  nicNumber: string;
  onValidationSuccess: (data: { gender: 'male' | 'female'; birthdate: string }) => void;
}

export function NICValidator({ nicNumber, onValidationSuccess }: NICValidatorProps) {
  const [isValidated, setIsValidated] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [nicData, setNicData] = useState<{ gender: 'male' | 'female'; birthdate: string } | null>(
    null,
  );

  const validateNIC = () => {
    if (!nicNumber) {
      setValidationError('Please enter a NIC number');
      return;
    }

    const isValid = nicUtils.isValidNIC(nicNumber);

    if (!isValid) {
      setValidationError('Invalid NIC number. Please check and try again.');
      return;
    }

    try {
      const info = nicUtils.extractInfoFromNIC(nicNumber);
      const nicGender = info.gender === 'MALE' ? 'male' : 'female';
      const nicBirthdate = format(info.dateOfBirth, 'yyyy-MM-dd');

      setNicData({
        gender: nicGender,
        birthdate: nicBirthdate,
      });
      setValidationError(null);
    } catch {
      setValidationError('Error extracting information from NIC');
    }
  };

  const confirmInfo = () => {
    if (nicData) {
      onValidationSuccess(nicData);
      setIsValidated(true);
    }
  };

  if (isValidated) {
    return (
      <Alert variant='success' className='my-4 bg-green-50 border-green-200'>
        <CheckCircle className='h-4 w-4 text-green-600' />
        <AlertTitle className='text-green-800'>NIC Validated</AlertTitle>
        <AlertDescription className='text-green-700'>
          Your NIC has been successfully validated.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className='my-4'>
      <CardContent className='pt-6'>
        {validationError && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {nicData && (
          <div className='mb-4 p-4 border rounded-md bg-blue-50'>
            <h4 className='font-medium mb-2'>NIC Information</h4>
            <p className='text-sm mb-1'>Gender: {nicData.gender === 'male' ? 'Male' : 'Female'}</p>
            <p className='text-sm'>
              Date of Birth: {format(new Date(nicData.birthdate), 'dd MMM yyyy')}
            </p>
          </div>
        )}

        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <Button type='button' variant='outline' onClick={validateNIC} className='flex-1'>
            Validate NIC
          </Button>

          {nicData && (
            <Button type='button' onClick={confirmInfo} className='flex-1'>
              Confirm Information
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
