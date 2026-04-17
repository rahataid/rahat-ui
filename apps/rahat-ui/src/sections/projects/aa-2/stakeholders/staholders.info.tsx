import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { DataItem } from 'apps/rahat-ui/src/common';
import { User } from 'lucide-react';
// import DataCard from '../../common/dataCard';

type IProps = {
  stakeholder: any;
};

const StakeHolderInfo = ({ stakeholder }: IProps) => {
  return (
    <>
      <div className="flex items-center">
        <div className="h-24 w-24 rounded-sm  bg-gray-700 flex justify-center items-center">
          <User className="" color="white" />
        </div>

        <div className="flex flex-col ml-6">
          <h1 className="text-2xl">{stakeholder?.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 px-6 py-4">
        <DataItem label="Phone Number" value={stakeholder?.phone} />
        <DataItem label="Email" value={stakeholder?.email} />
        <DataItem label="Designation" value={stakeholder?.designation} />
        <DataItem label="Organization" value={stakeholder?.organization} />
        <DataItem label="District " value={stakeholder?.district} />
        <DataItem label="Municipality" value={stakeholder?.municipality} />

        <div>
          <h1 className="text-lg text-black">Support Area</h1>
          {stakeholder?.supportArea?.map((a) => {
            return (
              <Badge
                className="text-sm text-muted-foreground font-medium w-auto mr-2"
                key={a}
              >
                {a}
              </Badge>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StakeHolderInfo;
