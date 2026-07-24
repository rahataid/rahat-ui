import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
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
import { Pencil, Trash2 } from 'lucide-react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import StakeholdersEditPanel from './stakeholders.edit.view';
import { useDeleteStakeholders } from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { setPaginationToLocalStorage } from '../prev.pagination.storage';

export default function useStakeholdersTableColumn() {
  const t = useTranslations('GLOBAL');
  const tc = useTranslations('Confirmation & Alert Dialogs');
  const { id } = useParams();
  const router = useRouter();
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const deleteStakeholder = useDeleteStakeholders();

  const removeStakeholder = async (stakeholder: IStakeholdersItem) => {
    await deleteStakeholder.mutateAsync({
      projectUUID: id as UUID,
      stakeholderPayload: {
        uuid: stakeholder?.uuid,
      },
    });
    closeSecondPanel();
  };

  const columns: ColumnDef<IStakeholdersItem>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
      cell: ({ row }) => <div>{row.getValue('email') || 'N/A'}</div>,
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => <div>{row.getValue('designation')}</div>,
    },
    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => <div>{row.getValue('organization')}</div>,
    },
    {
      accessorKey: 'district',
      header: 'District',
      cell: ({ row }) => <div>{row.getValue('district')}</div>,
    },
    {
      accessorKey: 'municipality',
      header: 'Municipality',
      cell: ({ row }) => <div>{row.getValue('municipality')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-3 items-center">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Pencil
                    className="hover:text-primary cursor-pointer"
                    size={20}
                    strokeWidth={1.5}
                    onClick={() => {
                      setPaginationToLocalStorage();

                      const params = new URLSearchParams();
                      params.set('storePagination', 'true');
                      router.replace(`${window.location.pathname}?${params}`);

                      setSecondPanelComponent(
                        <StakeholdersEditPanel
                          stakeholdersDetail={row.original}
                          closeSecondPanel={closeSecondPanel}
                        />,
                      );
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">{t('EDIT')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <AlertDialog>
                    <AlertDialogTrigger className="flex items-center">
                      <Trash2
                        className="cursor-pointer"
                        color="red"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t('ARE_YOU_ABSOLUTELY_SURE')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {tc('THIS_ACTION_CANNOT_BE_UNDONE_THIS', { name: 'stakeholder' })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('CANCEL')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeStakeholder(row.original)}
                        >
                          {t('CONTINUE')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">{t('DELETE')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return columns;
}
