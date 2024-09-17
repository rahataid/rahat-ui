import { Ticket } from 'lucide-react';
import Back from '../../components/back';
import { useParams } from 'next/navigation';

export default function VouchersManage() {
  const { id } = useParams();
  return (
    <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
      <div className="flex space-x-3 mb-10">
        <Back path={`/projects/el-kenya/${id}/vouchers`} />
        <div>
          <h1 className="font-semibold text-2xl mb-">
            Create Voucher Disbursement
          </h1>
          <p className="text-muted-foreground">Create a disbursement plan.</p>
        </div>
      </div>
      <div className="rounded-sm bg-card p-6 shadow-md w-96">
        <div className="flex justify-between items-center">
          <h1 className="text-sm">Voucher Balance</h1>
          <div className="p-1 rounded-full bg-secondary text-primary">
            <Ticket size={16} strokeWidth={2.5} />
          </div>
        </div>
        <p className="text-primary font-semibold text-xl">1439</p>
      </div>
    </div>
  );
}
