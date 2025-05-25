'use client';

{
   
}

import { ColumnDef } from '@tanstack/react-table';
import { RenewPassportResponse, RenewPassportStatus } from '@/types/passportRenewalTypes';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusColors = {
  [RenewPassportStatus.PENDING]: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  [RenewPassportStatus.VERIFIED]: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  [RenewPassportStatus.REJECTED]: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

export const columns: ColumnDef<RenewPassportResponse>[] = [
  {
    accessorKey: '_id',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Request ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Full Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'nicNumber',
    header: 'NIC',
  },
  {
    accessorKey: 'currentPassportNumber',
    header: 'Passport No.',
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <ArrowUpDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              {Object.values(RenewPassportStatus).map(status => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => column.setFilterValue(status)}
                  className='capitalize'
                >
                  {status.toLowerCase()}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => column.setFilterValue(null)}
                className='text-red-600'
              >
                <X className='mr-2 h-4 w-4' />
                Clear filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
          </Button>
        </div>
      );
    },

    cell: ({ row }) => {
      const status = row.original.status;
      return <Badge className={statusColors[status as keyof typeof statusColors]}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value ? row.getValue(id) === value : true;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Submitted On
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm'),
  },
];
