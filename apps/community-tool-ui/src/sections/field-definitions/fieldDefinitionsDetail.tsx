import { useRouter } from 'next/navigation';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Archive, Expand, FilePenLine, Minus, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../components/dialog';
import { paths } from '../../routes/paths';
import EditFieldDefinition from './editFieldDefinition';
import InfoCards from './InfoCards';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';

type IProps = {
  data: FieldDefinition;
  // handleDefault: VoidFunction;
  handleClose: VoidFunction;
};

export default function FieldDefinitionsDetail({ data, handleClose }: IProps) {
  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger onClick={handleClose}>
                  <Minus size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TabsList>
            <TabsTrigger value="detail">Details </TabsTrigger>

            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="detail">
          <InfoCards data={data} />
        </TabsContent>

        <TabsContent value="edit">
          <EditFieldDefinition data={data} />
        </TabsContent>
      </Tabs>
    </>
  );
}
