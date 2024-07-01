'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  useProjectList,
  useSendFundToProject,
  useSettingsStore,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { useTreasuryTokenDetail } from 'libs/query/src/lib/treasury/treasury.service';
import { Banknote, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
        tokenAddress: appContracts?.rahattoken?.address,
        treasuryAddress: appContracts?.rahattreasury?.address,
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
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="border border-gray-300 p-2 rounded mb-4">
              {selectedProject
                ? projects?.data?.data?.find(
                    (p) => p.contractAddress === selectedProject,
                  )?.name
                : 'Select a project'}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white border border-gray-300 rounded shadow-lg">
              {projects?.data?.data?.map((project) => (
                <DropdownMenu.Item
                  key={project.id}
                  onSelect={() => handleSelectProject(project.contractAddress)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {project.name}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Input
            placeholder="Amount"
            className="w-full mb-4"
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {selectedProject && (
            <div className="mb-4">
              Selected Project:{' '}
              {
                projects?.data?.data?.find(
                  (p) => p.contractAddress === selectedProject,
                )?.name
              }
            </div>
          )}
          <Button onClick={handleSendFunds}>
            <Plus className="mr-2" size={20} strokeWidth={1.25} />
            Send fund to project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetsDetails;
