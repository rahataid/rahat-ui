'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from '../../../../providers/second-panel-provider';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Eye, Trash2 } from 'lucide-react';
import { IActivitiesItem } from '../../../../types/activities';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ActivitiesDetailView } from '.';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useDeleteActivities } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function useActivitiesTableColumn() {
  const { id } = useParams();
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const deleteActivity = useDeleteActivities();

  const deleteRow = (row: any) => {
    deleteActivity.mutateAsync({
      projectUUID: id as UUID,
      activityPayload: {
        uuid: row.id,
      },
    });
  };

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
      accessorKey: 'hazardType',
      header: 'Hazard Type',
      cell: ({ row }) => <div>{row.getValue('hazardType')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-3 items-center">
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
            <AlertDialog>
              <AlertDialogTrigger>
                <Trash2
                  className="cursor-pointer"
                  color="red"
                  size={20}
                  strokeWidth={1.5}
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this activity.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteRow(row.original)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return columns;
}
