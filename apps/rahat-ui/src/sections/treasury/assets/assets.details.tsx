'use client';

import {
  useProjectList,
  useSendFundToProject,
  useSettingsStore,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Banknote, Plus } from 'lucide-react';
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

const AssetsDetails = () => {
  const projects = useProjectList();
  const [selectedProject, setSelectedProject] = useState<`0x${string}`>('');
  const [amount, setAmount] = useState<string>('');
  const sendFundToProject = useSendFundToProject();
  const appContracts = useSettingsStore((state) => state.contracts);
  console.log('contracts', appContracts);

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
          number="RahatToken"
          Icon={Banknote}
        />
        <DataCard className="" title="Symbol" number={'RTH'} Icon={Banknote} />
        <DataCard className="" title="Balance" number={'0'} Icon={Banknote} />
        <DataCard className="" title="Value" number={'0'} Icon={Banknote} />
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
