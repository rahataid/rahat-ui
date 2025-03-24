import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Back, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Pencil, Trash2 } from 'lucide-react';

export default function TriggerStatementDetail() {
  return (
    <div className="p-4">
      <Back />
      <div className="flex justify-between items-center mb-4">
        <Heading
          title="Trigger Details"
          description="Detailed view of the selected trigger"
        />
        <div className="flex space-x-2">
          <IconLabelBtn
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
            Icon={Trash2}
            name="Delete"
            handleClick={() => {}}
          />
          <IconLabelBtn
            variant="outline"
            className="text-gray-500"
            Icon={Pencil}
            name="Edit"
            handleClick={() => {}}
          />
          <Button>Trigger</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 border rounded-sm">
          <Heading
            title="Ensure the Distribution of Emergency Response Kits to All Identified
            High-Risk and Vulnerable Households in the Affected Areas"
            titleStyle="text-lg/7"
            description="Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero"
          />
          <div className="grid grid-cols-4 text-sm/4 text-muted-foreground mt-6">
            <div>
              <p className="mb-1">River Basin</p>
              <p>Karnali</p>
            </div>
            <div>
              <p className="mb-1">Phase</p>
              <Badge>Preparedness</Badge>
            </div>
            <div>
              <p className="mb-1">Trigger Type</p>
              <Badge>Automated</Badge>
            </div>
            <div>
              <p className="mb-1">Type</p>
              <Badge>Optional</Badge>
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-sm">
          <Heading
            title="Forecast Data"
            titleStyle="text-sm/4"
            description={`Source:${'Karnali'}`}
          />
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 text-center border rounded">
              <p className="font-semibold text-3xl/10 text-primary">3</p>
              <p className="font-medium text-sm/6">Minimum Lead Time Days</p>
            </div>
            <div className="p-3 text-center border rounded">
              <p className="font-semibold text-3xl/10 text-primary">5</p>
              <p className="font-medium text-sm/6">Maximum Lead Time Days</p>
            </div>
            <div className="p-3 text-center border rounded">
              <p className="font-semibold text-3xl/10 text-primary">0.98</p>
              <p className="font-medium text-sm/6">Forecast Probability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
