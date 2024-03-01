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
} from 'lucide-react';

type IProps = {
  title: string;
};

const Nav = ({ title }: IProps) => {
  return (
    <>
      <h1 className="px-4 pt-4 pb-2 font-semibold text-xl text-primary">
        {title}
      </h1>
      <ScrollArea className="h-auto">
        <div>
          <nav className="text-muted-foreground p-2">
            <div className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
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
      <ScrollArea className="h-auto">
        <div>
          <nav className="text-muted-foreground p-2">
            <div className="flex p-2 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
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
    </>
  );
};
export default Nav;
