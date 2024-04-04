'use client';
import {
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Input } from '@rahat-ui/shadcn/components/input';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Search } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { ListBeneficiary } from '@rahat-ui/types';
import BeneficiaryCard from '../../sections/beneficiary/card';
import { IBeneficiaryItem } from '../../types/beneficiary';
import BeneficiaryDetail from './beneficiaryDetail';

type IProps = {
  data: ListBeneficiary[];
};

export default function GridView({ data }: IProps) {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  return (
    <>
      <ScrollArea className="px-4 pt-2 h-withPage">
        <div className="grid 2xl:grid-cols-1 gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8 rounded" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data?.map((data: IBeneficiaryItem) => (
            <BeneficiaryCard
              key={data.uuid}
              walletAddress={data.walletAddress}
              updatedAt={data.updatedAt}
              verified={data.verified}
              handleClick={() =>
                setSecondPanelComponent(
                  <>
                    <ResizableHandle />
                    <ResizablePanel minSize={28} defaultSize={28}>
                      <BeneficiaryDetail
                        beneficiaryDetail={data}
                        closeSecondPanel={closeSecondPanel}
                      />
                    </ResizablePanel>
                  </>,
                )
              }
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
