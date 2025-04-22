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
        <div className="h-24 w-24 rounded-md  bg-gray-700 flex justify-center items-center">
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
      </div>
    </>
  );
};

export default StakeHolderInfo;
