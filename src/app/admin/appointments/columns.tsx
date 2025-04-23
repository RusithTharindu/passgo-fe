'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Appointment, AppointmentStatus } from '@/types/appointmentTypes';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const statusColors = {
  [AppointmentStatus.PENDING]: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  [AppointmentStatus.APPROVED]: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  [AppointmentStatus.REJECTED]: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
  [AppointmentStatus.CANCELLED]: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
  [AppointmentStatus.COMPLETED]: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
};

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: 'appointmentId',
    header: 'ID',
  },
  {
    accessorKey: 'fullName',
    header: 'Full Name',
  },
  {
    accessorKey: 'nicNumber',
    header: 'NIC',
  },
  {
    accessorKey: 'preferredLocation',
    header: 'Location',
  },
  {
    accessorKey: 'preferredDate',
    header: 'Date',
    cell: ({ row }) => format(new Date(row.original.preferredDate), 'dd/MM/yyyy'),
  },
  {
    accessorKey: 'preferredTime',
    header: 'Time',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm'),
  },
];
