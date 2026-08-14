import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { IProjectVendor } from '../types';
import { useAAVendorsStore } from '@rahat-ui/query';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';

export const useProjectVendorTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatPhone = usePhoneFormat();
  const { vendors, setVendorDetails } = useAAVendorsStore((state) => ({
    vendors: state.vendors,
    setVendorDetails: state.setVendorDetails,
  }));
  const handleViewClick = (vendorId: string) => {
    vendors?.find((vendor) => {
      if (vendor.uuid === vendorId) {
        setVendorDetails(vendor);
      }
    });
    router.push(`/projects/aa/${id}/vendors/${vendorId}`);
  };
  const columns: ColumnDef<IProjectVendor>[] = [
    {
      accessorKey: 'name',
      header: tg('NAME'),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: tg('PHONE_NUMBER'),
      cell: ({ row }) => <div>{formatPhone(row.getValue('phone')) || tg('N_A')}</div>,
    },
    {
      accessorKey: 'location',
      header: tg('LOCATION'),
      cell: ({ row }) => <div>{row.getValue('location') || tg('N_A')}</div>,
    },
    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleViewClick(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
