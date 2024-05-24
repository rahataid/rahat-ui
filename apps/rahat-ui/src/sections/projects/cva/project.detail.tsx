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
import { ProjectChart } from 'apps/rahat-ui/src/sections/projects';
import { CircleDollarSign, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import DataCard from '../../../components/dataCard';
import { UUID } from 'crypto';

export default function ProjectDetails() {
  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  //temp contract call
  const tokenBalance = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken.address as `0x${string}`,
    args: [contractSettings?.cvaproject.address as `0x${string}`],
    query: {
      select(data) {
        return data ? formatEther(data) : 'N/A';
      },
    },
  });

  // useEffect(() => {
  //   return useWatchRahatTokenEvent({
  //     address: contractSettings?.rahattoken.address as `0x${string}`,
  //   });
  // }, [contractSettings?.rahattoken.address]);

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
          number={'0'}
          Icon={Users}
          subTitle="Total"
        />
        <DataCard
          className=""
          title="Balance"
          subTitle="Total"
          number={tokenBalance.data?.toString()}
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

      <ProjectChart chartData={[]} />
    </div>
  );
}
