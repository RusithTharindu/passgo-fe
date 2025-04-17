'use client';

import { ColumnDef } from '@tanstack/react-table';

// Define the shape of the data
export type Application = {
  _id: string;
  surname: string;
  otherNames: string;
  typeOfService: 'normal' | 'oneDay';
  TypeofTravelDocument: 'all' | 'middleEast' | 'emergencyCertificate' | 'identityCertificate';
  submittedBy: string;
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
    header: 'Type of Service',
    cell: ({ row }) => {
      const value = row.getValue('typeOfService') as string;
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  {
    accessorKey: 'TypeofTravelDocument',
    header: 'Type of Travel Document',
    cell: ({ row }) => {
      const value = row.getValue('TypeofTravelDocument') as string;
      return value
        .split(/(?=[A-Z])/)
        .join(' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    },
  },
  {
    accessorKey: 'submittedBy',
    header: 'Submitted By',
  },
];
