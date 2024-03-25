import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Meta } from '@rahat-ui/types';
import {
  AlignJustify,
  Import,
  LayoutGrid,
  Plus,
  Users,
  Upload,
  Settings,
  List,
} from 'lucide-react';
import { BENEFICIARY_NAV_ROUTE } from '../../constants/beneficiary.const';
import Link from 'next/link';
import { paths } from '../../routes/paths';
import { SETTINGS_NAV_ROUTE } from '../../constants/settings.const';

type IProps = {
  title: string;
  handleNav: (item: string) => void;
};

export default function SettingNav({ title, handleNav }: IProps) {
  return (
    <>
      <div>
        <div className="flex justify-between items-center p-4 border-6">
          <h1 className="px-4 pt-4 pb-2 font-semibold text-xl text-primary">
            {title}
          </h1>
        </div>

        <ScrollArea className="h-auto mb-2">
          <div className="px-4">
            <nav>
              <div
                className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
                onClick={() => handleNav(SETTINGS_NAV_ROUTE.DEFAULT)}
              >
                <div className="flex items-center gap-3">
                  <List size={18} strokeWidth={1.5} />
                  <p>List Settings</p>
                </div>
              </div>

              <div
                className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
                onClick={() => handleNav(SETTINGS_NAV_ROUTE.ADD_SETTINGS)}
              >
                <div className="flex items-center gap-3">
                  <Plus size={18} strokeWidth={1.5} />
                  <p>Add Settings</p>
                </div>
              </div>
            </nav>
          </div>
        </ScrollArea>
      </div>
      <Separator />
    </>
  );
}
