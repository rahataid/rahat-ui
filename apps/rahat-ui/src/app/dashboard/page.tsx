import { ResizablePanel } from '@rahat-ui/shadcn/components/resizable';
import type { Metadata } from 'next';
import { Carousel } from '@rahat-ui/shadcn/components/carousel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Button } from '@rahat-ui/shadcn/components/button';
import { useGet } from '@rahat-ui/query/hooks';
import useError from '../../store/error';

export const metadata: Metadata = {
  title: 'DashBoard',
};

export default function DashBoardPage() {
  console.log(process.env.NEXT_PUBLIC_HOST_API);
  const { data, error, isLoading } = useGet({
    store:{useError},
    queryKey: ['myData', { param1: 'value1' }], // replace with your query key and parameters
    queryFn: async () => {
      const response = await fetch('https://localhost:5500/v1/users'); // replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();

    },
  });

  console.log('error', error)
  return (
    <ResizablePanel minSize={30}>
      <div className="p-4">
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="grid grid-cols-subgrid gap-4 col-span-3">
            <Carousel />
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
