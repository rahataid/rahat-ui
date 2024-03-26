import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { RadialChart } from '@rahat-ui/shadcn/src/components/charts';
import {
  EllipsisVertical,
  TriangleAlert,
  CircleCheck,
  CircleX,
} from 'lucide-react';

export default function PhaseCard() {
  return (
    <div className="grid grid-cols-3 p-2 gap-2 bg-secondary pb-0">
      <Card className="h-auto overflow-hidden">
        <CardContent className="flex p-2">
          <div>
            <RadialChart series={[30]} total={15} label="Preparedness" />
          </div>
          <div>
            <div className="flex justify-between">
              <p className="font-medium text-xl mb-2">Preparedness</p>
              <EllipsisVertical size={20} strokeWidth={1.5} />
            </div>
            <p className="font-normal text-md pr-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex justify-end mt-2">
              <div className="flex gap-3">
                <TriangleAlert color="yellow" size={20} strokeWidth={1.5} />
                <CircleCheck color="green" size={20} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-auto overflow-hidden">
        <CardContent className="flex p-2">
          <RadialChart series={[50]} total={5} label="Readiness" />
          <div>
            <div className="flex justify-between">
              <p className="font-medium text-xl">Readiness</p>
              <EllipsisVertical size={20} strokeWidth={1.5} />
            </div>
            <p className="font-normal text-md pr-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex justify-end mt-2">
              <div className="flex gap-3">
                <TriangleAlert color="yellow" size={20} strokeWidth={1.5} />
                <CircleX color="red" size={20} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-auto overflow-hidden">
        <CardContent className="flex p-2">
          <RadialChart series={[70]} total={10} label="Activation" />
          <div>
            <div className="flex justify-between">
              <p className="font-medium text-xl">Activation</p>
              <EllipsisVertical size={20} strokeWidth={1.5} />
            </div>
            <p className="font-normal text-md pr-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex justify-end mt-2">
              <div className="flex gap-3">
                <TriangleAlert color="yellow" size={20} strokeWidth={1.5} />
                <CircleCheck color="green" size={20} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
