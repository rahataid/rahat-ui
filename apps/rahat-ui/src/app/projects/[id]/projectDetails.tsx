import ChartsCard from '../../../components/chartsCard';
import DataCard from '../../../components/dataCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DashBoard',
};

export default function ProjectDetails() {
  return (
    <div className="p-4">
      <div className="mb-4 grid md:grid-cols-3 gap-4">
        <DataCard
          className="h-40"
          title="Beneficiaries"
          number={'12'}
          subTitle="Total"
        />
        <DataCard className="" title="Balance" number={'12'} subTitle="Nrs" />
        <DataCard
          className=""
          title="Distributed"
          number={'12'}
          subTitle="Nrs"
        />
      </div>
      <div className="grid grid-cols-1 border rounded-lg p-4">
        <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
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
        <div>
          <p className="mt-4 sm:mt-8 sm:w-2/3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
            nihil eligendi possimus accusantium explicabo error aliquam fugiat
            voluptas ab enim aspernatur adipisci, non id ullam blanditiis
            nesciunt, dolores sit odio.
          </p>
        </div>
      </div>
      <div className="mt-4 grid md:grid-cols-4 gap-4">
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />

        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
      </div>
    </div>
  );
}
