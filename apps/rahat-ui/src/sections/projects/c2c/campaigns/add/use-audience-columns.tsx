import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Audience } from '@rahat-ui/types';
import { TPIIData } from '@rahataid/sdk';
import { ColumnDef } from '@tanstack/react-table';
import { SelectedRowType } from './add-campaign-view';

export const useAudienceColumns = (
  beneficiaryData: { data: { piiData: TPIIData }[] },
  selectedRows: SelectedRowType[],
  setSelectedRows: any,
) => {
  // const handleCreateAudience = (item: TPIIData) => {
  //   const checkAudienceExist = audienceData?.some(
  //     (audience: Audience) => audience?.details?.phone === item.phone,
  //   );

  //   if (!checkAudienceExist) {
  //     createAudience?.mutateAsync({
  //       details: {
  //         name: item.name,
  //         phone: item.phone,
  //         email: item.email,
  //       },
  //     });
  //   }
  // };
  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={beneficiaryData?.data?.length === selectedRows.length}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedRows([]);

              beneficiaryData?.data?.map((item) => {
                setSelectedRows((prevSelectedRows: SelectedRowType[]) => [
                  ...prevSelectedRows,
                  {
                    phone: item?.piiData?.phone,
                    email: item?.piiData?.email,
                  },
                ]);
              });
            } else if (!value) {
              setSelectedRows([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={
              selectedRows &&
              selectedRows.some((data) => data.phone === row?.original.phone)
            }
            aria-label="Select row"
            onCheckedChange={(checked) => {
              const item = row.original;

              setSelectedRows((prevSelectedRows: SelectedRowType[]) =>
                checked
                  ? [
                      ...prevSelectedRows,
                      { phone: item?.phone, email: item?.email },
                    ]
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
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
  ];
  return columns;
};
