'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useReadRahatTokenBalanceOf,
} from '@rahat-ui/query';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { useProjectAction } from '@rahat-ui/query';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { CircleDollarSign, Users } from 'lucide-react';

type IProps = {
  project: any;
};

export default function ProjectDetails({ project }: IProps) {
  const projectClient = useProjectAction();
  console.log('projectClient', projectClient?.data);

  return (
    <div className="p-4 bg-slate-100">
      <Card className="shadow-sm mb-4">
        <CardHeader>
          <CardTitle>{project?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-4 flex-wrap">
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
        </CardContent>
        <CardFooter>
          <p>{project?.description}</p>
        </CardFooter>
      </Card>
      <div className="grid md:grid-cols-3 gap-4">
        <DataCard
          className="h-40"
          title="Beneficiaries"
          number={'0'}
          Icon={Users}
          subTitle="Total"
        />
        <DataCard
          className=""
          title="Balance"
          subTitle="Total"
          number={'12'}
          Icon={CircleDollarSign}
        />

        <DataCard
          className="h-40"
          title="Distributed"
          number={'0'}
          Icon={Users}
          subTitle="Total"
        />
      </div>

      {/* <ProjectChart chartData={[]} /> */}
    </div>
  );
}
