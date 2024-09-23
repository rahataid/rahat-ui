import { useParams, useSearchParams } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import { UUID } from 'crypto';
import { User } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export default function ConfirmSelection({}) {
  const { id } = useParams() as { id: UUID };
  const searchParam = useSearchParams();
  const benef = searchParam.get('benef');
  return (
    <div className="flex flex-col justify-between">
      <div className="p-4">
        <HeaderWithBack
          title="Confirmation"
          subtitle="Confirm your selection before you proceed"
          path={`/projects/el-kenya/${id}/vouchers/manage`}
        />
        <div className="rounded-md border p-4 grid grid-cols-2 gap-4">
          <div className="bg-secondary rounded-md p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Beneficiary Selected
              </p>
              <p className="text-base font-medium">4</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Project Voucher Balance
              </p>
              <p className="text-base font-medium">500</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Distribute Vouchers to Beneficiaries
              </p>
              <p className="text-base font-medium">1</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Vouchers to Distribute
              </p>
              <p className="text-base font-medium">100</p>
            </div>
          </div>
          <div className="rounded-md p-4">
            <p className="text-base font-medium">
              {benef ? 'Beneficiary' : 'Beneficiary Group'} List
            </p>
            <p className="text-sm text-muted-foreground">
              {benef ? '40 Beneficiaries' : '5 Beneficiaries Groups'} Selected
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="p-2 rounded-full bg-secondary">
                    <User size={18} strokeWidth={1.5} />
                  </div>
                  <p>A L</p>
                </div>
                <p>1</p>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="p-2 rounded-full bg-secondary">
                    <User size={18} strokeWidth={1.5} />
                  </div>
                  <p>A L</p>
                </div>
                <p>1</p>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="p-2 rounded-full bg-secondary">
                    <User size={18} strokeWidth={1.5} />
                  </div>
                  <p>A L</p>
                </div>
                <p>1</p>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="p-2 rounded-full bg-secondary">
                    <User size={18} strokeWidth={1.5} />
                  </div>
                  <p>A L</p>
                </div>
                <p>1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary">Close</Button>
        <Button>Finish</Button>
      </div>
    </div>
  );
}
