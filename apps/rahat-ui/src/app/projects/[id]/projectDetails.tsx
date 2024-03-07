import DataCard from '../../../components/dataCard';
import { Users, CircleDollarSign } from 'lucide-react';
import { ProjectChart } from 'apps/rahat-ui/src/sections/projects';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

export default function ProjectDetails() {
  return (
    <div className="p-4 bg-slate-100">
      <Card className="shadow-sm mb-4">
        <CardHeader>
          <CardTitle>Project Name</CardTitle>
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
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
            nihil eligendi possimus accusantium explicabo error aliquam fugiat
            voluptas ab enim aspernatur adipisci, non id ullam blanditiis
            nesciunt, dolores sit odio.
          </p>
        </CardFooter>
      </Card>
      <div className="grid md:grid-cols-3 gap-4">
        <DataCard
          className="h-40"
          title="Beneficiaries"
          number={'12'}
          subTitle="Total"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Balance"
          number={'12'}
          subTitle="Nrs"
          Icon={CircleDollarSign}
        />

        <DataCard
          className=""
          title="Distributed"
          number={'12'}
          subTitle="Nrs"
          Icon={Users}
        />
      </div>

      <ProjectChart />
    </div>
  );
}
