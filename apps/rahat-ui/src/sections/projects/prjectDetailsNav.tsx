import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Lock,
  Pencil,
  PlusSquare,
  Speech,
  Store,
  ToggleLeft,
  UsersRound,
  Phone,
  MessageSquareText,
  BadgeDollarSign,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { PROJECT_DETAIL_NAV_ROUTE } from '../../constants/project.detail.const';

type IProps = {
  title: string;
  handleNav: (item: string) => void;
  active: string;
};

export default function Nav({ title, handleNav, active }: IProps) {
  const [showCampaigns, setShowCampaigns] = useState(false);
  return (
    <>
      <div>
        <div className="flex items-center justify-between p-4">
          <h1 className="font-semibold text-xl text-slate-600">{title}</h1>
        </div>
      </div>
      {/* <ScrollArea className="h-auto"> */}
      <div>
        <nav className="p-2 text-muted-foreground">
          <div
            className={`flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white ${
              active === PROJECT_DETAIL_NAV_ROUTE.BENEFICIARY &&
              'text-black bg-secondary'
            }`}
            onClick={() => handleNav(PROJECT_DETAIL_NAV_ROUTE.BENEFICIARY)}
          >
            <div className="flex items-center gap-3">
              <UsersRound size={18} strokeWidth={1.5} />
              <p>Beneficiaries</p>
            </div>
            <p className="text-sm">128</p>
          </div>
          <div
            className={`flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white ${
              active === PROJECT_DETAIL_NAV_ROUTE.VENDOR &&
              'text-black bg-secondary'
            }`}
            onClick={() => handleNav(PROJECT_DETAIL_NAV_ROUTE.VENDOR)}
          >
            <div className="flex items-center gap-3">
              <Store size={18} strokeWidth={1.5} />
              <p>Vendors</p>
            </div>
            <p className="text-sm">32</p>
          </div>
          <div
            className={`flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white ${
              active === PROJECT_DETAIL_NAV_ROUTE.TRANSACTION &&
              'text-black bg-secondary'
            }`}
            onClick={() => handleNav(PROJECT_DETAIL_NAV_ROUTE.TRANSACTION)}
          >
            <div className="flex items-center gap-3">
              <BadgeDollarSign size={18} strokeWidth={1.5} />
              <p>Transactions</p>
            </div>
            <p className="text-sm">32</p>
          </div>
          <div>
            <div
              className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white "
              onClick={() => setShowCampaigns(!showCampaigns)}
            >
              <div className="flex items-center gap-3">
                <Speech size={18} strokeWidth={1.5} /> <p>Campaigns</p>
              </div>
              <p className="text-sm">9</p>
            </div>
            <div
              className={`pl-6 transition-all ease-in-out duration-300 ${
                showCampaigns ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'
              }`}
            >
              <div
                className={`flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white ${
                  active === PROJECT_DETAIL_NAV_ROUTE.VOICE &&
                  'text-black bg-secondary'
                }`}
                onClick={() => handleNav(PROJECT_DETAIL_NAV_ROUTE.VOICE)}
              >
                <div className="flex items-center gap-3">
                  <Phone size={18} strokeWidth={1.5} /> <p>Voice</p>
                </div>
                <p className="text-sm">9</p>
              </div>
              <div
                className={`flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white ${
                  active === PROJECT_DETAIL_NAV_ROUTE.TEXT &&
                  'text-black bg-secondary'
                }`}
                onClick={() => handleNav(PROJECT_DETAIL_NAV_ROUTE.TEXT)}
              >
                <div className="flex items-center gap-3">
                  <MessageSquareText size={18} strokeWidth={1.5} /> <p>Text</p>
                </div>
                <p className="text-sm">9</p>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* </ScrollArea> */}
      <Separator />
      {/* <h1 className="p-4 font-semibold text-xl text-slate-600">Actions</h1> */}
      <ScrollArea className="h-auto">
        <div>
          <nav className="p-2">
            <Dialog>
              <DialogTrigger className="w-full">
                <div className="flex p-2 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                  <PlusSquare size={18} strokeWidth={1.5} />
                  <p>Create Token</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Token</DialogTitle>
                  <DialogDescription>
                    Enter Token to create in the project
                  </DialogDescription>
                </DialogHeader>
                <Input type="text" placeholder="Token" />
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-primary"
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger className="w-full">
                <div className="flex p-2 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                  <Lock size={18} strokeWidth={1.5} />
                  <p>Lock project</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lock Project</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to lock this project?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-primary"
                  >
                    Lock
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div
              className="flex p-2 items-center gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleNav(PROJECT_DETAIL_NAV_ROUTE.EDIT)}
            >
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
}
