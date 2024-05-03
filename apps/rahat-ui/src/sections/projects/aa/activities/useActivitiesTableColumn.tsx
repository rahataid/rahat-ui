import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { Eye } from 'lucide-react';
import { IActivitiesItem } from '../../../../types/activities';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ActivitiesDetailView } from '.';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export default function useActivitiesTableColumn() {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

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
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize">
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'phase',
      header: 'Phase',
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize">
          {row.getValue('phase')}
        </Badge>
      ),
    }, 
    {
      accessorKey: 'activityType',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize">
          {row.getValue('activityType')}
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
      accessorKey: 'hazardType',
      header: 'Hazard Type',
      cell: ({ row }) => <div>{row.getValue('hazardType')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Badge
            className={`rounded-md capitalize bg-green-200
              }`}
          >
            {row.getValue('status')}
          </Badge>
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        // console.log(row)
        return (
          <Eye
            className="hover:text-primary cursor-pointer"
            size={20}
            strokeWidth={1.5}
            onClick={() => {
              setSecondPanelComponent(
                <ActivitiesDetailView
                  activityDetail={row.original}
                  closeSecondPanel={closeSecondPanel}
                />,
              );
            }}
          />
        );
      },
    },
  ];

  return columns;
}
