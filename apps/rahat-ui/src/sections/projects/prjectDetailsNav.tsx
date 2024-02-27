import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  Lock,
  Pencil,
  PlusSquare,
  Speech,
  Store,
  ToggleLeft,
  UsersRound,
  XCircle,
} from 'lucide-react';

type IProps = {
  title: string;
};

export default function Nav({ title }: IProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="p-4 font-semibold text-xl text-slate-600">{title}</h1>
      </div>
      <ScrollArea className="h-48">
        <div>
          <nav>
            <div className="flex justify-between p-4 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <UsersRound size={18} strokeWidth={1.5} />
                <p>Beneficiaries</p>
              </div>
              <p className="text-sm">128</p>
            </div>
            <div className="flex justify-between p-4 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <Store size={18} strokeWidth={1.5} />
                <p>Vendors</p>
              </div>
              <p className="text-sm">32</p>
            </div>
            <div className="flex justify-between p-4 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <Speech size={18} strokeWidth={1.5} /> <p>Campaigns</p>
              </div>
              <p className="text-sm">9</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
      <Separator />
      <h1 className="p-4 font-semibold text-xl text-slate-600">Actions</h1>
      <ScrollArea className="h-72">
        <div>
          <nav>
            <div className="flex p-4 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <PlusSquare size={18} strokeWidth={1.5} /> <p>Create Voucher</p>
            </div>
            <div className="flex p-4 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <XCircle size={18} strokeWidth={1.5} />
              <p>Close Project</p>
            </div>
            <div className="flex p-4 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Pencil size={18} strokeWidth={1.5} />
              <p>Edit Project</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
