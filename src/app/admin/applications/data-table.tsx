'use client';

{
  /* eslint-disable @typescript-eslint/no-unused-vars */
}
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Application, columns } from './columns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: Application[];
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const surname = ((row.getValue('surname') as string) || '').toLowerCase();
      const otherNames = ((row.getValue('otherNames') as string) || '').toLowerCase();

      return surname.includes(searchValue) || otherNames.includes(searchValue);
    },
  });

  const handleFilterChange = (value: string, columnId: string) => {
    table.getColumn(columnId)?.setFilterValue(value === 'all' ? undefined : value);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Input
          placeholder='Search by name...'
          value={globalFilter ?? ''}
          onChange={event => setGlobalFilter(event.target.value)}
          className='max-w-sm'
        />
        <Select
          value={(table.getColumn('typeOfService')?.getFilterValue() as string) ?? 'all'}
          onValueChange={value => handleFilterChange(value, 'typeOfService')}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='All Services' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Services</SelectItem>
            <SelectItem value='normal'>Normal</SelectItem>
            <SelectItem value='oneDay'>One Day</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn('TypeofTravelDocument')?.getFilterValue() as string) ?? 'all'}
          onValueChange={value => handleFilterChange(value, 'TypeofTravelDocument')}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='All Documents' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Documents</SelectItem>
            <SelectItem value='middleEast'>Middle East</SelectItem>
            <SelectItem value='emergencyCertificate'>Emergency Certificate</SelectItem>
            <SelectItem value='identityCertificate'>Identity Certificate</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={value => handleFilterChange(value, 'status')}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='All Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='processing'>Processing</SelectItem>
            <SelectItem value='submitted'>Submitted</SelectItem>
            <SelectItem value='verified'>Verified</SelectItem>
            <SelectItem value='approved'>Approved</SelectItem>
            <SelectItem value='ready_for_collection'>Ready for Collection</SelectItem>
            <SelectItem value='collected'>Collected</SelectItem>
            <SelectItem value='rejected'>Rejected</SelectItem>
            <SelectItem value='cancelled'>Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[200px] justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {selectedDate ? format(selectedDate, 'PPP') : 'Filter by date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={date => {
                setSelectedDate(date);
                table.getColumn('createdAt')?.setFilterValue(date?.toISOString());
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {selectedDate && (
          <Button
            variant='ghost'
            onClick={() => {
              setSelectedDate(undefined);
              table.getColumn('createdAt')?.setFilterValue(undefined);
            }}
          >
            Reset Date
          </Button>
        )}
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          Showing {table.getFilteredRowModel().rows.length} of {data.length} results
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
