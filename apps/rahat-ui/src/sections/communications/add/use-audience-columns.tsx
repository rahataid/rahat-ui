import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Audience } from '@rahat-ui/types';
import { TPIIData } from '@rahataid/sdk';
import { ColumnDef } from '@tanstack/react-table';
import { SelectedRowType } from './add-campaign-view';

export const useAudienceColumns = (
  beneficiaryData: { data: TPIIData[] },
  selectedRows: SelectedRowType[],
  audienceData: { data: Audience[] },
  createAudience: any,
  setSelectedRows: any,
) => {
  const handleCreateAudience = (item: TPIIData) => {
    const checkAudienceExist = audienceData?.data.some(
      (audience: Audience) => audience?.details?.phone === item.phone,
    );

    if (!checkAudienceExist) {
      createAudience?.mutateAsync({
        details: {
          name: item.name,
          phone: item.phone,
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
            if (value && selectedRows.length === 0) {
              beneficiaryData?.data?.map((item) => {
                handleCreateAudience(item);

                setSelectedRows((prevSelectedRows: SelectedRowType[]) => [
                  ...prevSelectedRows,
                  {
                    name: item.name,
                    id: item.beneficiaryId,
                    phone: item.phone,
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
      cell: ({ row }) => (
        <Checkbox
          checked={
            selectedRows &&
            selectedRows.some((data) => data.id === row?.original.id)
          }
          aria-label="Select row"
          onCheckedChange={(checked) => {
            const item = row.original;

            handleCreateAudience(item);
            setSelectedRows((prevSelectedRows: SelectedRowType[]) =>
              checked
                ? [...prevSelectedRows, item]
                : selectedRows?.filter(
                    (value) => (value.id || value.beneficiaryId) !== item.id,
                  ),
            );
          }}
        />
      ),
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
  ];
  return columns;
};
