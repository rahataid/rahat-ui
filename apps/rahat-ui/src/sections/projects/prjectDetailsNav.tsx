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
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PROJECT_DETAIL_NAV_ROUTE } from '../../constants/project.detail.const';

type IProps = {
  title: string;
  handleNav: (item: string) => void;
};

export default function Nav({ title, handleNav }: IProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="px-4 pt-4 pb-2 font-semibold text-xl text-primary">
          {title}
        </h1>
        <Badge variant="outline" className="border-red-400 bg-red-50 mr-4">
          Locked
        </Badge>
      </div>
      <ScrollArea className="h-auto">
        <div>
          <nav className="p-2">
            <div
              className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleNav(PROJECT_DETAIL_NAV_ROUTE.BENEFICIARY)}
            >
              <div className="flex items-center gap-3">
                <UsersRound size={18} strokeWidth={1.5} />
                <p>Beneficiaries</p>
              </div>
              <p className="text-sm">128</p>
            </div>
            <div
              className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleNav(PROJECT_DETAIL_NAV_ROUTE.VENDOR)}
            >
              <div className="flex items-center gap-3">
                <Store size={18} strokeWidth={1.5} />
                <p>Vendors</p>
              </div>
              <p className="text-sm">32</p>
            </div>
            {/* <div className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex items-center gap-3">
                <Speech size={18} strokeWidth={1.5} /> <p>Campaigns</p>
              </div>
              <p className="text-sm">9</p>
            </div> */}
          </nav>
        </div>
      </ScrollArea>
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
