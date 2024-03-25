'use client';

import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from '../../../../providers/second-panel-provider';

import { Eye } from 'lucide-react';
import { IActivitiesItem } from '../../../../types/activities';
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import ActivitiesData from './activities.json';
import { ActivitiesDetailView } from '.';
import { ResizablePanel } from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export default function useActivitiesTableColumn() {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [selectedAction, setSelectedAction] = useState('');
  const filteredData = useMemo(
    () =>
      selectedAction.length
        ? ActivitiesData.filter(
            (item) => item.category.toLowerCase() === selectedAction,
          )
        : ActivitiesData,
    [],
  );

  const columns: ColumnDef<IActivitiesItem>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //     accessorKey: 'title',
    //     header: () => (
    //         <Select onValueChange={(value) => setSelectedAction(value)}>
    //             <SelectTrigger className='w-auto border-0 p-0'>
    //                 <SelectValue placeholder="Actions" />
    //             </SelectTrigger>
    //             <SelectContent>
    //                 {ActivitiesData.map((item) => (
    //                     <SelectItem key={item.category.toLowerCase()} value={item.category.toLowerCase()} >
    //                         {item.category}
    //                     </SelectItem>
    //                 ))}
    //             </SelectContent>
    //         </Select>
    //     ),
    //     cell: ({ row }) => <div>{row.getValue('title')}</div>,
    // },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="secondary" className="rounded-md capitalize">
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'responsibility',
      header: 'Responsibility',
      cell: ({ row }) => <div>{row.getValue('responsibility')}</div>,
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => <div>{row.getValue('source')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            className="hover:text-primary cursor-pointer"
            size={20}
            strokeWidth={1.5}
            onClick={() => {
              setSecondPanelComponent(
                <ActivitiesDetailView
                  data={row.original}
                  closeSecondPanel={closeSecondPanel}
                />,
              );
            }}
          />
        );
      },
    },
  ];

  return { columns, data: filteredData };
}
