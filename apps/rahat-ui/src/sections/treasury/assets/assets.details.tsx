'use client';

import {
  useProjectList,
  useSendFundToProject,
  useSettingsStore,
} from '@rahat-ui/query';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { useTreasuryTokenDetail } from 'libs/query/src/lib/treasury/treasury.service';
import { Banknote } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AssetsModal } from './assets.modal';

const AssetsDetails = () => {
  const contractAddress = useParams()?.contractAddress;
  const projects = useProjectList();
  const [selectedProject, setSelectedProject] = useState<`0x${string}`>('');
  const [amount, setAmount] = useState<string>('');
  const [tokenDetail, setTokenDetail] = useState<any>();

  const sendFundToProject = useSendFundToProject();
  const appContracts = useSettingsStore((state) => state.contracts);

  const { data, isLoading } = useTreasuryTokenDetail(contractAddress as string);

  useEffect(() => {
    if (data) {
      console.log(`data ${data.data}`);
      setTokenDetail(data?.data);
    }
  }, [data]);

  const handleSendFunds = async () => {
    if (selectedProject) {
      // Replace this with the actual function to send funds
      console.log('Sending funds to project with address:', selectedProject);
      await sendFundToProject.mutateAsync({
        amount,
        projectAddress: selectedProject,
        tokenAddress: appContracts?.RAHATTOKEN?.ADDRESS,
        treasuryAddress: appContracts?.RAHATTREASURY?.ADDRESS,
      });
    } else {
      console.log('No project selected');
    }
  };

  const handleSelectProject = (contractAddress: `0x${string}`) => {
    setSelectedProject(contractAddress);
  };

  return (
    <div className="p-2 bg-secondary h-[calc(100vh-80px)]">
      <div className="grid grid-cols-4 gap-2">
        <DataCard
          className=""
          title="Name"
          number={tokenDetail?.name}
          Icon={Banknote}
        />
        <DataCard
          className=""
          title="Symbol"
          number={tokenDetail?.symbol}
          Icon={Banknote}
        />
        <DataCard
          className=""
          title="Initial Supply"
          number={tokenDetail?.initialSupply}
          Icon={Banknote}
        />
        <DataCard
          className=""
          title="Decimals"
          number={tokenDetail?.decimals}
          Icon={Banknote}
        />
      </div>
      <div className="mt-2">
        <div className="bg-card h-[calc(100vh-500px)] w-full flex flex-col justify-center items-center">
          <AssetsModal tokenAddress={contractAddress} />
        </div>
      </div>
    </div>
  );
};

export default AssetsDetails;
