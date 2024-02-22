import ProjectNav from '../../../components/projects/nav';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';
import ProjectDetails from './projectDetails';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function ProjectPage() {
  return (
    <div className="mb-5">
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold">Project Details</h1>
            <Badge variant={'outline'} className="border-red-400 bg-red-50">
              Locked
            </Badge>
          </div>
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
              <DropdownMenuContent className="mx-8">
                <DropdownMenuItem>Create Tokens</DropdownMenuItem>
                <DropdownMenuItem>Lock Project</DropdownMenuItem>
                <DropdownMenuItem>Edit Project</DropdownMenuItem>
                <DropdownMenuItem>Set Offline Beneficiaries</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>{' '}
          </div>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-max border"
        >
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="h-full"
          >
            <ProjectNav />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <ScrollArea className="h-custom">
              <ProjectDetails />
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
