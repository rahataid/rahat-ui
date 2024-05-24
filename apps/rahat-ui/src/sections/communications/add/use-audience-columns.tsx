import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Audience } from '@rahat-ui/types';
import { TPIIData } from '@rahataid/sdk';
import { ColumnDef } from '@tanstack/react-table';
import { SelectedRowType } from './add-campaign-view';

export const useAudienceColumns = (
  beneficiaryData: { data: { piiData: TPIIData; Beneficiary: any }[] },
  selectedRows: SelectedRowType[],
  audienceData: { data: Audience[] },
  createAudience: any,
  setSelectedRows: any,
) => {
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
            if (value) {
              setSelectedRows([]);

              beneficiaryData?.data?.map((item) => {
                handleCreateAudience({
                  ...item.piiData,
                  url: item?.Beneficiary?.qrUrl,
                });
                setSelectedRows((prevSelectedRows: SelectedRowType[]) => [
                  ...prevSelectedRows,
                  {
                    name: item?.piiData?.name,
                    id: item?.piiData?.beneficiaryId,
                    phone: item?.piiData?.phone,
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
