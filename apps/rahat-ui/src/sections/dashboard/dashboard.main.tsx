import { usePagination } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Heading } from '../../common';
import SelectComponent from '../../common/select.component';
import AccessAndResilienceOverview from './component/accessAndResilienceOverview';
import BeneficiaryDemographics from './component/beneficiaryDemographics';
import CommunicationAnalytics from './component/communicationAnalytics';
import DigitalAccessOverview from './component/digitalAccessOverview';
import SocialProtectionOverview from './component/socialProtectionOverview';
import { MUNICIPALITY, WARDS } from './constant';

// const socialProtectionBenefits = [
//   { type: ' >70', households: 800 },
//   { type: ' Dalit >60', households: 950 },
//   { type: 'Child ', households: 630 },
//   { type: 'Single', households: 850 },
//   { type: 'Widow', households: 620 },
//   { type: 'Red ', households: 900 },
//   { type: 'Blue ', households: 790 },
//   { type: 'Indigenous', households: 830 },
// ];

// const bankAccounts = [
//   { bank: 'NIC Asia Bank Limited', accounts: 200 },
//   { bank: 'Global IME', accounts: 250 },
//   { bank: 'Agricultural', accounts: 140 },
//   { bank: 'NIC Asia', accounts: 180 },
//   { bank: 'Nepal Bank', accounts: 260 },
//   { bank: 'Kanchan Development Bank', accounts: 130 },
//   { bank: 'Bank 4', accounts: 140 },
//   { bank: 'Rastriya Banijya Bank', accounts: 240 },
//   { bank: 'Everest Bank', accounts: 210 },
//   { bank: 'Nabil Bank', accounts: 270 },
//   { bank: 'Siddhartha Bank', accounts: 190 },
//   { bank: 'Mega Bank', accounts: 175 },
//   { bank: 'Machhapuchchhre Bank', accounts: 160 },
//   { bank: 'Prabhu Bank', accounts: 220 },
//   { bank: 'Laxmi Sunrise Bank', accounts: 200 },
// ];

// const communicationData = [
//   {
//     category: 'Stakeholders',
//     totalCommunicationSent: 23000,
//     numberOfStakeholders: 5000,
//     avcsSuccessfullySent: 5000,
//     smsSuccessfullySent: 2000,
//     deliveryFailures: 1000,
//   },
//   {
//     category: 'Beneficiaries',
//     totalCommunicationSent: 23000,
//     avcsSuccessfullySent: 5000,
//     voiceMessageDelivered: 2000,
//     smsSuccessfullyDelivered: 1000,
//     deliveryFailures: 2000,
//     uniqueAvcRecipients: 1000,
//   },
// ];
const DashboardMain = () => {
  const { filters, setFilters } = usePagination();
  const handleFilterChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    const filterValue = value === 'ALL' ? '' : value;
    setFilters({
      ...filters,
      [name]: filterValue,
    });
  };

  return (
    <div className=" p-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4 mx-4">
        <Heading title="Dashboard" description="Overview of your system" />
        <div className="flex flex-row gap-3 lg:gap-4">
          <SelectComponent
            name="Ward"
            options={['ALL', ...WARDS]}
            onChange={(value) =>
              handleFilterChange({ target: { name: 'ward', value } })
            }
            value={filters?.ward || ''}
            className="w-full rounded-sm lg:w-48"
          />

          <SelectComponent
            name="Municipality"
            options={['ALL', ...MUNICIPALITY]}
            onChange={(value) =>
              handleFilterChange({ target: { name: 'municipality', value } })
            }
            value={filters?.municipality || ''}
            className="w-full rounded-sm lg:w-48"
          />
        </div>
      </div>

      <ScrollArea className="p-4 h-[calc(100vh-150px)]">
        <BeneficiaryDemographics />
        <DigitalAccessOverview />
        <SocialProtectionOverview />
        <AccessAndResilienceOverview />
        <CommunicationAnalytics />
      </ScrollArea>
    </div>
  );
};

export default DashboardMain;
