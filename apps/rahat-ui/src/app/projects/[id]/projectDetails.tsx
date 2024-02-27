import ChartsCard from '../../../components/chartsCard';
import DataCard from '../../../components/dataCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DashBoard',
};

export default function ProjectDetails() {
  return (
    <div className="p-4">
      <div className="mb-4 grid md:grid-cols-5 gap-4">
        <DataCard
          className=" border-green-500"
          title="Beneficiaries"
          number1={'12'}
          subTitle1="Registered"
          number2={'12'}
          subTitle2="Referred"
        />
        <DataCard
          className="border-green-500"
          title="Voucher Details"
          number1={'12'}
          subTitle1="Discount"
          number2={'12'}
          subTitle2="Free"
        />
        <DataCard
          className="border-yellow-500"
          title="Redemmed"
          number1={'12'}
          subTitle1="Free"
          number2={'12'}
          subTitle2="Discount"
        />
        <DataCard
          className="border-red-500"
          title="Discount Voucher Details"
          number1={'12'}
          subTitle1="Bought"
          number2={'12'}
          subTitle2="Not Bought"
        />
        <DataCard
          className="border-red-500"
          title="Eye Checkup Details"
          number1={'12'}
          subTitle1="Required Glasses"
          number2={'12'}
          subTitle2="Not Required"
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
          <p className="mt-4 sm:mt-8 sm:w-2/3">Janaki Rural Municiplality.</p>
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
