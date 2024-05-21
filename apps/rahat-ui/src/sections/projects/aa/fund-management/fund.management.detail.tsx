import {
  ArrowLeft,
  Banknote,
  Blocks,
  Coins,
  Pencil,
  Text,
  Trash2,
} from 'lucide-react';
import AddButton from '../../components/add.btn';
import { BeneficiaryList } from './fm.beneficiary.list.moda';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

const FundManagementDetails = () => {
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-60px)]">
      {/* BREADCRUMB */}
      <div className="flex items-center justify-between mt-4 mb-4 ml-2">
        <div className="flex items-center gap-2">
          <ArrowLeft size={20} strokeWidth={1.25} />
          <h1 className="text-xl font-medium text-gray-800">
            Demo For Title For Fund Management (dmeo 1)
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-card border border-primary cursor-pointer">
            <Pencil className="text-primary" size={20} strokeWidth={1.5} />
          </div>
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-card border border-red-500 cursor-pointer">
            <Trash2 className="text-red-500" size={20} strokeWidth={1.5} />
          </div>
        </div>
      </div>
      {/* DATACARD */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-4 rounded-sm bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Coins size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-medium">Token Value</h1>
            <p className="text-xl text-primary font-semibold">{'10,000'}</p>
          </div>
        </div>
        <div className="p-4 rounded-sm bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Blocks size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-medium">No. of Token</h1>
            <p className="text-xl text-primary font-semibold">{'2'}</p>
          </div>
        </div>
        <div className="p-4 rounded-sm bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Banknote size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-medium">Fund Management</h1>
            <p className="text-xl text-primary font-semibold">{'20,000'}</p>
          </div>
        </div>
      </div>
      {/* PROJECT INFO */}
      <div className="col-span-4 rounded bg-card p-4 shadow mt-4 h-60">
        <div>
          <p className="font-medium">Fund Managemet</p>
        </div>
        <div className="flex items-center flex-wrap mt-2 gap-10 md:gap-32">
          <div>
            <p className="font-light text-muted-foreground">Projet name demo</p>
            <p className="font-normal text-primary">Project</p>
          </div>
          <div>
            <p className="font-light text-muted-foreground">
              Beneficiary Group
            </p>
            <div className="flex items-center gap-1">
              <p className="font-normal text-primary ">
                Beneficiary Group Name Demo
              </p>
              <BeneficiaryList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundManagementDetails;
