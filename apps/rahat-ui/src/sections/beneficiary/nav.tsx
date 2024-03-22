'use client';

import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Meta } from '@rahat-ui/types';
import { AlignJustify, Import, LayoutGrid, Plus, Users } from 'lucide-react';
import { BENEFICIARY_NAV_ROUTE } from '../../constants/beneficiary.const';
import MultipleSelectFilter from './multipleSelectFilter';
import { PROJECT_DETAIL_NAV_ROUTE } from '../../constants/project.detail.const';
import { Table } from '@tanstack/react-table';
import { ListBeneficiary } from '@rahat-ui/types';
import { useRouter } from 'next/navigation';

type IProps = {
  meta: Meta | undefined;
  handleNav: (item: string) => void;
  active: string;
  table: Table<ListBeneficiary>;
};

export default function Nav({ meta, handleNav, active, table }: IProps) {
  const router = useRouter();
  const handleAddBeneficiaryClick = () => {
    router.push('/beneficiary/add');
  };
  return (
    <>
      <div>
        <div
          className={`flex justify-between items-center border-6 ${
            active === PROJECT_DETAIL_NAV_ROUTE.DEFAULT ? 'p-2' : 'py-3.5 px-2'
          }`}
        >
          <h1 className="font-semibold text-xl text-primary">Beneficiaries</h1>
          {active === PROJECT_DETAIL_NAV_ROUTE.DEFAULT && (
            <TabsList>
              <TabsTrigger value="list">
                <AlignJustify size={18} strokeWidth={1.5} />
              </TabsTrigger>
              <TabsTrigger value="grid">
                <LayoutGrid size={18} strokeWidth={1.5} />
              </TabsTrigger>
            </TabsList>
          )}
        </div>
        {/* todo: for temp scroll area height is h-20 but after uncomment  inside the nav tag scroll area height should be 44 as initial */}
        <ScrollArea className="h-auto mb-2">
          <div className="px-4">
            <nav>
              <div
                className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
                onClick={() => router.push('/beneficiary')}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} strokeWidth={1.5} />
                  <p>Beneficiaries</p>
                </div>
                <p>{meta?.total}</p>
              </div>
            </nav>
          </div>
        </ScrollArea>
      </div>
      <Separator />
      <ScrollArea>
        <div className="p-2">
          {/* <h1 className="font-semibold text-xl mb-4 text-muted-foreground">
            Action Items
          </h1> */}
          <nav className="text-muted-foreground">
            <div
              onClick={handleAddBeneficiaryClick}
              className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
            >
              <Plus size={18} strokeWidth={1.5} />
              <p>Add beneficiaries</p>
            </div>
            <div
              className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() =>
                handleNav(BENEFICIARY_NAV_ROUTE.IMPORT_BENEFICIARY)
              }
            >
              <Import size={18} strokeWidth={1.5} />
              <p>Import beneficiaries</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
      {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
        <>
          <Separator className="mb-2" />
          <MultipleSelectFilter table={table} />
        </>
      )}
    </>
  );
}
