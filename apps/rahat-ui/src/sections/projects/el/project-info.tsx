'use client';

import { Users } from 'lucide-react';
import type { Metadata } from 'next';
import { ProjectChart } from '..';
import ChartsCard from '../../../components/chartsCard';
import DataCard from '../../../components/dataCard';

export const metadata: Metadata = {
  title: 'DashBoard',
};

export default function ProjectDetails() {
  return (
    <div className="p-2 bg-secondary">
      <div className="grid grid-cols-1 border rounded-sm bg-card p-4 mb-2">
        <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
          <div>
            <p className="font-medium text-primary">Achyut</p>
            <p className="font-light">Project Manager</p>
          </div>
          <div>
            <p className="font-medium text-primary">12</p>
            <p className="font-light">Vendors</p>
          </div>
          <div>
            <p className="font-medium text-primary">01 Feb 2024</p>
            <p className="font-light">Start Date</p>
          </div>
          <div>
            <p className="font-medium text-primary">24 Feb 2024</p>
            <p className="font-light">End Date</p>
          </div>
        </div>
        <div>
          <p className="mt-4 sm:mt-8 sm:w-2/3">Janaki Rural Municiplality.</p>
        </div>
      </div>
      <div className="mb-2 grid md:grid-cols-3 gap-2">
        <DataCard
          className=""
          title="Beneficiaries"
          number1={'12'}
          subTitle1="Enrolled"
          number2={'12'}
          subTitle2="Referred"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Voucher Details"
          number1={'12'}
          subTitle1="Free"
          number2={'12'}
          subTitle2="Discount"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Redemmed"
          number1={'12'}
          subTitle1="Free"
          number2={'12'}
          subTitle2="Discount"
          Icon={Users}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <DataCard
          className=""
          title="Eye Checkup Details"
          number1={'12'}
          subTitle1="Checked Glasses Required"
          number2={'12'}
          subTitle2="Checked Glasses Not Required"
          Icon={Users}
        />
        <DataCard
          className=""
          title="Discount Voucher Details"
          number1={'12'}
          subTitle1="Glasses Bought"
          number2={'12'}
          subTitle2="Glasses Not Bought"
          Icon={Users}
        />
      </div>

      <ProjectChart />
    </div>
  );
}
