import { ArrowLeft, Blocks, Pencil, Trash2 } from 'lucide-react';
import { BeneficiaryList } from './fm.beneficiary.list.modal';
import { useParams, useRouter } from 'next/navigation';
import { useSingleGroupReservedFunds } from '@rahat-ui/query';
import { UUID } from 'crypto';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import Back from '../../components/back';

const FundManagementDetails = () => {
  const { id: projectID, fundId } = useParams();

  const { data, isLoading } = useSingleGroupReservedFunds(
    projectID as UUID,
    fundId,
  );

  if (isLoading) return <Loader />;

  return (
    <div className="p-2 bg-secondary h-[calc(100vh-60px)]">
      {/* BREADCRUMB */}
      <div className="flex items-center justify-between mt-4 mb-4 ml-2">
        <div className="flex items-center gap-2">
          <Back
            path={`/projects/aa/${projectID}/fund-management?backFromDetail=true`}
          />
          <h1 className="text-xl font-medium text-gray-800">{data?.title}</h1>
        </div>
        {/* <div className="flex items-center gap-1">
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-card border border-primary cursor-pointer">
            <Pencil className="text-primary" size={20} strokeWidth={1.5} />
          </div>
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-card border border-red-500 cursor-pointer">
            <Trash2 className="text-red-500" size={20} strokeWidth={1.5} />
          </div>
        </div> */}
      </div>
      {/* DATACARD */}
      <div className="grid grid-cols-4 gap-3">
        {/* <div className="p-4 rounded-sm bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Coins size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-medium">Token Value</h1>
            <p className="text-xl text-primary font-semibold">{'10,000'}</p>
          </div>
        </div> */}
        <div className="p-4 rounded-sm bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Blocks size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-medium">No. of Token</h1>
            <p className="text-xl text-primary font-semibold">
              {data?.numberOfTokens}
            </p>
          </div>
        </div>
        {/* <div className="p-4 rounded-sm bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Banknote size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-medium">Fund Management</h1>
            <p className="text-xl text-primary font-semibold">{'20,000'}</p>
          </div>
        </div> */}
      </div>
      {/* PROJECT INFO */}
      <div className="col-span-4 rounded bg-card p-4 shadow mt-4 h-60">
        <div>
          <p className="font-medium">Fund Management</p>
        </div>
        <div className="flex items-center flex-wrap mt-2 gap-10 md:gap-32">
          {/* <div>
            <p className="font-light text-muted-foreground">Projet name demo</p>
            <p className="font-normal text-primary">Project</p>
          </div> */}
          <div>
            <p className="font-light text-muted-foreground">
              Beneficiary Group
            </p>
            <div className="flex items-center gap-1">
              <p className="font-normal text-primary ">{data?.name}</p>
              <BeneficiaryList beneficiaryData={data?.groupedBeneficiaries} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundManagementDetails;
