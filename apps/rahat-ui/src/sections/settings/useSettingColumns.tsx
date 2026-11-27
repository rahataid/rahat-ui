'use client';

import { useTranslations } from 'next-intl';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import { GlobalCan } from 'apps/rahat-ui/src/components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { useSecondPanel } from '../../providers/second-panel-provider';
import EditSettings from './edit.settings';
interface SettingData {
  name: string;
  dataType: string;
  isPrivate: boolean;
  isReadOnly: boolean;
  requiredFields: [];
  value: any;
}
export const useSettingTableColumns = () => {
  const t = useTranslations('SETTINGS_TABLE_COLUMNS');
  const g = useTranslations('GLOBAL');
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<SettingData>[] = [
    {
      header: g('NAME'),
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      header: t('DATATYPE'),
      accessorKey: 'dataType',
      cell: ({ row }) => <div>{row.getValue('dataType')}</div>,
    },
    {
      header: t('ISPRIVATE'),
      accessorKey: 'isPrivate',
      cell: ({ row }) => <div>{row.original.isPrivate ? g('YES') : g('NO')}</div>,
    },
    {
      header: t('ISREADONLY'),
      accessorKey: 'isReadOnly',
      cell: ({ row }) => <div>{row.original.isReadOnly ? g('YES') : g('NO')}</div>,
    },
    {
      header: t('REQUIREDFIELDS'),
      accessorKey: 'requiredFields',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.requiredFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </div>
        );
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      header: g('ACTIONS'),

      cell: ({ row }) => {
        return (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <GlobalCan action={ACTIONS.UPDATE} subject={SUBJECTS.SETTINGS}>
                    <Edit
                      size={20}
                      strokeWidth={1.5}
                      className="cursor-pointer hover:text-primary"
                      onClick={() =>
                        setSecondPanelComponent(
                          <>
                            <EditSettings
                              closeSecondPanel={closeSecondPanel}
                              settingData={row?.original && row?.original}
                            />
                          </>,
                        )
                      }
                    />
                  </GlobalCan>
                </span>
              </TooltipTrigger>

              <TooltipContent>{g('EDIT')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
  ];

  return columns;
};
