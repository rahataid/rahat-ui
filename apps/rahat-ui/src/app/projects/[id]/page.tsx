import { ResizablePanel } from '@/components/ui/resizable';
import type { Metadata } from 'next';
import { DashBoardCarousel } from '@/components/dashboardCarousel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'DashBoard',
};

export default function DashBoardPage() {
  return (
    <ResizablePanel>
      <div className="p-4">
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="grid grid-cols-subgrid gap-4 col-span-3">
            <DashBoardCarousel />
          </div>
          <div className="grid grid-rows-3 grid-flow-col gap-4">
            <div className="border rounded-lg h-16 flex justify-around items-center">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant={'outline'}>Associates List</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Beneficiaries</DropdownMenuItem>
                    <DropdownMenuItem>Vendors</DropdownMenuItem>
                    <DropdownMenuItem>Campaigns</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant={'outline'}>Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Create Tokens</DropdownMenuItem>
                    <DropdownMenuItem>Lock Project</DropdownMenuItem>
                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>
                      Set Offline Beneficiaries
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid grid-rows-subgrid gap-4 row-span-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Accusantium eos repellat qui? Neque at assumenda, quam quaerat
              aliquid unde ut voluptate suscipit iure aliquam. Fugit modi
              voluptatem mollitia est saepe.
            </div>
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
}
