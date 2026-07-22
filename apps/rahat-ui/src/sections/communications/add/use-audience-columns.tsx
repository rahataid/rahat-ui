import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Audience } from '@rahat-ui/types';
import { TPIIData } from '@rahataid/sdk';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { SelectedRowType } from './add-campaign-view';

export const useAudienceColumns = (
  beneficiaryData: { data: { piiData: TPIIData; Beneficiary: any }[] },
  selectedRows: SelectedRowType[],
  audienceData: { data: Audience[] },
  createAudience: any,
  setSelectedRows: any,
) => {
  const tg = useTranslations('GLOBAL');
  const handleCreateAudience = (item: TPIIData & { url: string }) => {
    const checkAudienceExist = audienceData?.data.some(
      (audience: Audience) => audience?.details?.phone === item.phone,
    );

    if (!checkAudienceExist) {
      createAudience?.mutateAsync({
        details: {
          name: item.name,
          phone: item.phone,
          email: item.email,
          url: item?.url,
        },
      });
    }
  };
  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={beneficiaryData?.data?.length === selectedRows.length}
          onCheckedChange={(value) => {
            const filteredRowModel = table.getFilteredRowModel().rows;
            if (value) {
              setSelectedRows([]);

              filteredRowModel?.map((item) => {
                handleCreateAudience({
                  ...item.original,
                });
                setSelectedRows((prevSelectedRows: SelectedRowType[]) => [
                  ...prevSelectedRows,
                  {
                    name: item?.original?.name,
                    id: item?.original?.id,
                    phone: item?.original?.phone,
                  },
                ]);
              });
            } else if (!value) {
              setSelectedRows([]);
            }
          }}
          aria-label={tg('SELECT_ALL')}
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={
              selectedRows &&
              selectedRows.some((data) => data.phone === row?.original.phone)
            }
            aria-label={tg('SELECT_ROW')}
            onCheckedChange={(checked) => {
              const item = row.original;

              handleCreateAudience(item);
              setSelectedRows((prevSelectedRows: SelectedRowType[]) =>
                checked
                  ? [...prevSelectedRows, item]
                  : selectedRows?.filter(
                      (value) => value?.phone !== item?.phone,
                    ),
              );
            }}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: tg('NAME'),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: tg('PHONE'),
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'email',
      header: tg('EMAIL'),
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
  ];
  return columns;
};
