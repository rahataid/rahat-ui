'use client';

import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { useUserStore } from '@rumsan/react-query';
import { Eye, PlusSquare } from 'lucide-react';
import { USER_NAV_ROUTE } from '../../constants/user.const';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRumsanService } from '../../providers/service.provider';
import { use } from 'react';
// type IProps = {
//   // onAddUsersClick: VoidFunction;
//   onTabChange: (tab: string) => void;
// };

export default function Nav() {
  const { projectQuery } = useRumsanService();
  const totalUser = useUserStore.getState().totalUser;

  const projectsList = projectQuery.useProjectList({});
  const d = projectsList.data;
  const projectList = d?.data || [];

  const handleProjectChange = (d: string) => {
    console.log('D==>', d);
  };

  return (
    <>
      <div className="bg-card border-b">
        <div className="flex justify-between items-center p-4">
          <h1 className="font-semibold text-xl text-primary">Vendors</h1>
        </div>
      </div>
      <ScrollArea className="h-auto mb-2 bg-card">
        <div className="px-4">
          <nav>
            <div
              //   onClick={() => handleTabClick(USER_NAV_ROUTE.DEFAULT)}
              className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground mt-2"
            >
              <div className="flex items-center gap-3">
                <Eye size={18} strokeWidth={1.5} />
                <p>Vendors </p>
              </div>
              <p></p>
            </div>
          </nav>
          {/* <div className="py-2 w-full border-t">
            <div className="p-4 flex flex-col gap-0.5 text-sm">
              <Dialog>
                <DialogTrigger className=" hover:bg-muted p-1 rounded text-left">
                  Assign Projects
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Project</DialogTitle>
                    <DialogDescription>
                      Select the project to be assigned to the beneficiary
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <Select onValueChange={handleProjectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Projects" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectList.length > 0 &&
                          projectList.map((project: any) => {
                            return (
                              <SelectItem key={project.id} value={project.id}>
                                {project.title}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Close
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-primary"
                    >
                      Assign
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div> */}
        </div>
      </ScrollArea>
    </>
  );
}
