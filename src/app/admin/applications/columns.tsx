'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ApplicationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'submitted'
  | 'verified'
  | 'ready_for_collection'
  | 'collected'
  | 'cancelled';

// Define the shape of the data
export type Application = {
  _id: string;
  surname: string;
  otherNames: string;
  typeOfService: 'normal' | 'oneDay';
  TypeofTravelDocument: 'all' | 'middleEast' | 'emergencyCertificate' | 'identityCertificate';
  submittedBy: string;
  status: ApplicationStatus;
};

type TravelDocumentStyles = {
  [K in Application['TypeofTravelDocument']]: string;
};

type TravelDocumentText = {
  [K in Application['TypeofTravelDocument']]: string;
};

type StatusStyles = {
  [K in ApplicationStatus]: string;
};

// Define the columns for the data table
export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: '_id',
    header: 'User ID',
  },
  {
    accessorKey: 'surname',
    header: 'Surname',
  },
  {
    accessorKey: 'otherNames',
    header: 'Other Names',
  },
  {
    accessorKey: 'typeOfService',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type of Service
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue('typeOfService') as string;
      return (
        <Badge
          className={cn(
            value === 'oneDay'
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
          )}
        >
          {value === 'oneDay' ? 'One Day' : 'Normal'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'TypeofTravelDocument',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type of Travel Document
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue('TypeofTravelDocument') as Application['TypeofTravelDocument'];

      const styles: TravelDocumentStyles = {
        all: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
        middleEast: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
        emergencyCertificate: 'bg-rose-100 text-rose-700 hover:bg-rose-100',
        identityCertificate: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100',
      };

      const displayText: TravelDocumentText = {
        all: 'All',
        middleEast: 'Middle East',
        emergencyCertificate: 'Emergency Certificate',
        identityCertificate: 'Identity Certificate',
      };

      return <Badge className={styles[value]}>{displayText[value]}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue('status') as ApplicationStatus;

      const styles: StatusStyles = {
        pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
        processing: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
        submitted: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100',
        verified: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
        approved: 'bg-green-100 text-green-700 hover:bg-green-100',
        ready_for_collection: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
        collected: 'bg-teal-100 text-teal-700 hover:bg-teal-100',
        rejected: 'bg-red-100 text-red-700 hover:bg-red-100',
        cancelled: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
      };

      const displayText = value
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return <Badge className={styles[value]}>{displayText}</Badge>;
    },
  },
  {
    accessorKey: 'submittedBy',
    header: 'Submitted By',
  },
];
