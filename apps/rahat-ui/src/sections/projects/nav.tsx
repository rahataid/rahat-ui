import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import {
  Lock,
  Pencil,
  PlusSquare,
  Speech,
  Store,
  ToggleLeft,
  UsersRound,
  KanbanSquare,
} from 'lucide-react';
import { PROJECT_NAV_ROUTE } from '../../constants/project.const';

type IProps = {
  title: string;
  handleNav: (item: string) => void;
};

const Nav = ({ title, handleNav }: IProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="p-4 font-semibold text-xl text-slate-600">{title}</h1>
      </div>
      <ScrollArea className="h-48">
        <div className="px-2 pb-4">
          <nav>
            <div className="flex justify-between p-4 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <UsersRound size={18} strokeWidth={1.5} />
                <p>Beneficiaries</p>
              </div>
              <p className="text-sm">128</p>
            </div>
            <div className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <Store size={18} strokeWidth={1.5} />
                <p>Vendors</p>
              </div>
              <p className="text-sm">32</p>
            </div>
            <div className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <Speech size={18} strokeWidth={1.5} /> <p>Campaigns</p>
              </div>
              <p className="text-sm">9</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
      <Separator />
      <ScrollArea className="h-72">
        <div>
          <h1 className="p-4 font-semibold text-xl text-slate-600">Actions</h1>
          <nav className="px-2">
            <div className="flex p-4 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <PlusSquare size={18} strokeWidth={1.5} /> <p>Create Tokens</p>
            </div>
            <div className="flex p-2 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Lock size={18} strokeWidth={1.5} />
              <p>Lock projects</p>
            </div>
            <div className="flex p-2 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Pencil size={18} strokeWidth={1.5} />
              <p>Edit projects</p>
            </div>
            <div className="flex p-2 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <ToggleLeft size={18} strokeWidth={1.5} />
              <p>Set Offline Benficiaries</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
};
export default Nav;
