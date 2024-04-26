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
    <div className="grid grid-cols-3 gap-2 bg-secondary pb-0">
      <Card>
        <CardContent className="flex p-2 pt-4">
          <RadialChart series={[30]} total={15} label="Preparedness" />
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <p className="font-semibold text-xl mb-2">Preparedness</p>
                <EllipsisVertical size={20} strokeWidth={1.5} />
              </div>
              <p className="font-normal text-sm pr-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="flex justify-end">
              <div className="flex gap-3">
                <TriangleAlert color="yellow" size={20} strokeWidth={1.5} />
                <CircleCheck color="green" size={20} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex p-2 pt-4">
          <RadialChart series={[50]} total={5} label="Readiness" />
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <p className="font-semibold text-xl mb-2">Readiness</p>
                <EllipsisVertical size={20} strokeWidth={1.5} />
              </div>
              <p className="font-normal text-sm pr-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="flex justify-end">
              <div className="flex gap-3">
                <TriangleAlert color="yellow" size={20} strokeWidth={1.5} />
                <CircleX color="red" size={20} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex p-2 pt-4">
          <RadialChart series={[70]} total={10} label="Activation" />
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <p className="font-semibold text-xl mb-2">Activation</p>
                <EllipsisVertical size={20} strokeWidth={1.5} />
              </div>
              <p className="font-normal text-sm pr-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="flex justify-end">
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
