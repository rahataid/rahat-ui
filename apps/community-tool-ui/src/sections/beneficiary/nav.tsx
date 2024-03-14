import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Meta } from '@rahat-ui/types';
import {
  AlignJustify,
  Import,
  LayoutGrid,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { BENEFICIARY_NAV_ROUTE } from '../../constants/beneficiary.const';
import Filter from './filter';

type IProps = {
  meta: Meta | undefined;
  handleNav: (item: string) => void;
};

export default function Nav({ meta, handleNav }: IProps) {
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
                  <p>Archived</p>
                </div>
                <p>9</p>
              </div> */}
              <div
                className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
                onClick={() => handleNav(BENEFICIARY_NAV_ROUTE.DEFAULT)}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} strokeWidth={1.5} />
                  {/* <Eye size={18} strokeWidth={1.5} /> */}
                  <p>Beneficiaries</p>
                </div>
                <p>{meta?.total}</p>
              </div>
              <div
                className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
                onClick={() => handleNav(BENEFICIARY_NAV_ROUTE.SETTINGS)}
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} strokeWidth={1.5} />
                  <p>Settings</p>
                </div>
              </div>
            </nav>
          </div>
        </ScrollArea>
      </div>
      <Filter />
      <Separator />
      <ScrollArea>
        <div className="p-2">
          {/* <h1 className="font-semibold text-xl mb-4 text-muted-foreground">
            Action Items
          </h1> */}
          <nav className="text-muted-foreground">
            <div
              onClick={() => handleNav(BENEFICIARY_NAV_ROUTE.ADD_BENEFICIARY)}
              className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
            >
              <Plus size={18} strokeWidth={1.5} />
              {/* <PlusSquare size={18} strokeWidth={1.5} /> */}
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
    </>
  );
}
