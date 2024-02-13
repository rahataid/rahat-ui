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
import DataCard from '@/components/dataCard';
import { Badge } from '@/components/ui/badge';
import ChartsCard from '@/components/chartsCard';

export const metadata: Metadata = {
  title: 'DashBoard',
};

export default function DashBoardPage() {
  return (
    <ResizablePanel>
      <div className="p-4">
        <div className="mb-4 grid md:grid-cols-3 gap-4">
          <DataCard
            className=""
            title="Beneficiaries"
            number={12}
            subTitle="household"
          />
          <DataCard
            className=""
            title="Beneficiaries"
            number={12}
            subTitle="household"
          />
          <DataCard
            className=""
            title="Beneficiaries"
            number={12}
            subTitle="household"
          />
        </div>
        <div className="grid grid-cols-1 border rounded-lg p-4">
          <div className="flex items-center justify-between ">
            <Badge variant={'outline'}>Locked</Badge>
            <div className="flex gap-2">
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
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={'outline'}>Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Create Tokens</DropdownMenuItem>
                  <DropdownMenuItem>Lock Project</DropdownMenuItem>
                  <DropdownMenuItem>Edit Project</DropdownMenuItem>
                  <DropdownMenuItem>Set Offline Beneficiaries</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>{' '}
            </div>
          </div>
          <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
            <div>
              <p className="font-medium">Achyut</p>
              <p className="font-light">Project Manager</p>
            </div>
            <div>
              <p className="font-medium">12</p>
              <p className="font-light">Vendors</p>
            </div>
            <div>
              <p className="font-medium">01 Feb 2024</p>
              <p className="font-light">Start Date</p>
            </div>
            <div>
              <p className="font-medium">24 Feb 2024</p>
              <p className="font-light">End Date</p>
            </div>
          </div>
          <div>
            <p className="mt-4 sm:mt-8 sm:w-2/3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
              nihil eligendi possimus accusantium explicabo error aliquam fugiat
              voluptas ab enim aspernatur adipisci, non id ullam blanditiis
              nesciunt, dolores sit odio.
            </p>
          </div>
        </div>
        <div className="mt-4 grid md:grid-cols-4 gap-4">
          <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
          <ChartsCard className="" title="Beneficiaries" image="/charts.png" />

          <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
          <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        </div>
        {/* <div className="grid sm:grid-cols-1 gap-4">
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
        </div> */}
        <div>{/* <DashBoardCarousel /> */}</div>
      </div>
    </ResizablePanel>
  );
}
