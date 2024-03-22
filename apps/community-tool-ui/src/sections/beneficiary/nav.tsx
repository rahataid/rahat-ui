import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { AlignJustify, Import, LayoutGrid, Plus, Users } from 'lucide-react';
import Filter from './filter';
import MultipleSelectFilter from './multipleSelectorFilter';

type IProps = {
  meta: Meta | undefined;
  handleNav: (item: string) => void;
  selectedData: number[];
  handleClose: () => void;
};

export default function Nav({
  meta,
  handleNav,
  selectedData,
  handleClose,
}: IProps) {
import Link from 'next/link';
import { paths } from '../../routes/paths';

// type IProps = {
//   meta?: Meta | undefined;
//   handleNav?: (item: string) => void;
// };

export default function Nav() {
  return (
    <>
      <div>
        <div className="flex justify-between items-center p-4 border-6">
          <h1 className="font-semibold text-xl text-primary">Beneficiaries</h1>
          <TabsList>
            <TabsTrigger value="list">
              <AlignJustify size={18} strokeWidth={1.5} />
            </TabsTrigger>
            <TabsTrigger value="grid">
              <LayoutGrid size={18} strokeWidth={1.5} />
            </TabsTrigger>
          </TabsList>
        </div>
        {/* todo: for temp scroll area height is h-20 but after uncomment  inside the nav tag scroll area height should be 44 as initial */}
        <ScrollArea className="h-auto mb-2">
          <div className="px-4">
            <nav>
              <div className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Users size={18} strokeWidth={1.5} />
                  {/* <Eye size={18} strokeWidth={1.5} /> */}
                  <Link href={paths.dashboard.beneficiary.root}>
                    Beneficiary List
                  </Link>
                </div>
                <p>{}</p>
              </div>
              <div
                className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
                onClick={() => handleNav(GROUP_NAV_ROUTE.VIEW_GROUP)}
              >
                <Import size={18} strokeWidth={1.5} />
                <p>Group</p>
              </div>
            </nav>
          </div>
        </ScrollArea>
      </div>
      <Filter />
      <Separator />
      <ScrollArea>
        <div className="p-2">
          <nav className="text-muted-foreground">
            <div className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Plus size={18} strokeWidth={1.5} />
              <p>Add Beneficiary</p>
            </div>

            <div
              className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() =>
                handleNav(BENEFICIARY_NAV_ROUTE.IMPORT_BENEFICIARY)
              }
            >
              <Link href={paths.dashboard.beneficiary.add}>
                {' '}
                Add Beneficiary
              </Link>
            </div>
            <div className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Import size={18} strokeWidth={1.5} />
              <Link href={paths.dashboard.beneficiary.import}>
                {' '}
                Import Beneficiary
              </Link>
            </div>
          </nav>
        </div>
      </ScrollArea>
      {selectedData && selectedData.length > 0 && (
        <>
          <Separator className="mb-2" />
          <MultipleSelectFilter
            selectedData={selectedData}
            handleClose={handleClose}
          />
        </>
      )}
    </>
  );
}
