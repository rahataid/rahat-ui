import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudDownload } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import BeneficiaryGroupView from './beneficiary.group.view';
import BeneficiaryTable from './beneficiary.table';

export default function BeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [defaultValue, setDefaultValue] = React.useState<string>('beneficiary');

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'beneficiary';

  useEffect(() => {
    setDefaultValue(tab);
  }, [tab]);

  interface BeneficiaryViewProps {
    id: UUID;
  }

  interface OnTabChange {
    (value: string): void;
  }

  const onTabChange: OnTabChange = (value) => {
    setDefaultValue(value);
  };

  return (
    <Tabs value={defaultValue} onValueChange={onTabChange}>
      <div className="flex justify-between items-center p-4 pb-0">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            id="beneficiary"
            className="w-full data-[state=active]:bg-white"
            value="beneficiary"
          >
            Beneficiary
          </TabsTrigger>
          <TabsTrigger
            id="beneficiaryGroups"
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryGroups"
          >
            Beneficiary Groups
          </TabsTrigger>
        </TabsList>
        {/* <Button
          variant="outline"
          onClick={() => router.push(`/projects/c2c/${id}/beneficiary/import`)}
        >
          <CloudDownload className="mr-1" /> Import beneficiaries
        </Button> */}
      </div>
      <TabsContent value="beneficiary">
        <BeneficiaryTable />
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div className="p-4 pt-2">
          <BeneficiaryGroupView />
        </div>
      </TabsContent>
    </Tabs>
  );
}
