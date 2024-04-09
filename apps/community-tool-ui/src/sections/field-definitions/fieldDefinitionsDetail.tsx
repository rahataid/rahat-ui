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

import { Minus } from 'lucide-react';
import EditFieldDefinition from './editFieldDefinition';
import InfoCards from './InfoCards';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import { useFieldDefinitionsListById } from '@rahat-ui/community-query';

type IProps = {
  fieldDefinitionData: FieldDefinition;
  // handleDefault: VoidFunction;
  handleClose: VoidFunction;
};

export default function FieldDefinitionsDetail({
  fieldDefinitionData,
  handleClose,
}: IProps) {
  const { data } = useFieldDefinitionsListById(String(fieldDefinitionData?.id));
  const singleFieldDefinition = data && data.data;

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
          <InfoCards data={singleFieldDefinition} />
        </TabsContent>

        <TabsContent value="edit">
          <EditFieldDefinition data={singleFieldDefinition} />
        </TabsContent>
      </Tabs>
    </>
  );
}
