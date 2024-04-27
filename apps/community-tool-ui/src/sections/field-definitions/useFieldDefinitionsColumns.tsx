'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import { humanizeString } from '../../utils';
import { useSecondPanel } from '../../providers/second-panel-provider';
import FieldDefinitionsDetail from './fieldDefinitionsDetail';

export const useFieldDefinitionsTableColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<FieldDefinition>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{humanizeString(row.getValue('name'))}</div>,
    },
    {
      accessorKey: 'fieldType',
      header: 'Field Type',
      cell: ({ row }) => <div>{row.getValue('fieldType')}</div>,
    },
    {
      accessorKey: 'isActive',
      header: 'Is Active',
      cell: ({ row }) => <div>{row.getValue('isActive') ? 'Yes' : 'No'}</div>,
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() =>
              setSecondPanelComponent(
                <>
                  <FieldDefinitionsDetail
                    fieldDefinitionData={row.original}
                    closeSecondPanel={closeSecondPanel}
                  />
                </>,
              )
            }
          />
        );
      },
    },
  ];

  return columns;
};
