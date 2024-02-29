import { Eye, EyeOff, ScreenShareOff, PlusSquare, Import } from 'lucide-react';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { LayoutGrid, AlignJustify } from 'lucide-react';
import { Meta } from '@rahat-ui/types';
import { BENEFICIARY_NAV_ROUTE } from '../../const/beneficiary.const';

type IProps = {
  onAddBenficiaryclick: VoidFunction;
  data: [] | null;
  handleImport: (item: string) => void;
};

export default function Nav({
  onAddBenficiaryclick,
  data,
  handleImport,
}: IProps) {
  return (
    <>
      <div>
        <div className="flex justify-between items-center p-4">
          <h1 className="font-semibold text-xl text-slate-600">
            Beneficiaries
          </h1>
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
        <ScrollArea className="h-20">
          <div className="px-4 pb-4">
            <nav>
              {/* <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <Eye size={18} strokeWidth={1.5} />
                  <p>Active beneficiaries</p>
                </div>
                <p>128</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <EyeOff size={18} strokeWidth={1.5} />
                  <p>Inactive beneficiaries</p>
                </div>
                <p>32</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <ScreenShareOff size={18} strokeWidth={1.5} />{' '}
                  <p>Disabled/ Deleted</p>
                </div>
                <p>9</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <Eye size={18} strokeWidth={1.5} />
                  <p>Active beneficiaries</p>
                </div>
                <p>128</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <EyeOff size={18} strokeWidth={1.5} />
                  <p>Inactive beneficiaries</p>
                </div>
                <p>32</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <ScreenShareOff size={18} strokeWidth={1.5} />{' '}
                  <p>Disabled/ Deleted</p>
                </div>
                <p>9</p>
              </div> */}
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex items-center gap-3">
                  <Eye size={18} strokeWidth={1.5} />
                  <p>Beneficiaries</p>
                </div>
                <p>{data?.length}</p>
              </div>
            </nav>
          </div>
        </ScrollArea>
      </div>
      <Separator />
      <ScrollArea>
        <div className="p-4">
          <h1 className="font-semibold text-xl text-slate-600 mb-4">
            Action Items
          </h1>
          <nav>
            <div
              onClick={onAddBenficiaryclick}
              className="flex items-center p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
            >
              <PlusSquare size={18} strokeWidth={1.5} />{' '}
              <p>Add beneficiaries</p>
            </div>
            <div
              className="flex items-center p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() =>
                handleImport(BENEFICIARY_NAV_ROUTE.IMPORT_BENEFICIARY)
              }
            >
              <Import size={18} strokeWidth={1.5} />
              <p>Import beneficiaries</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
