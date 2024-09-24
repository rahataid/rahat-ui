import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { User } from 'lucide-react';

export default function Confirmation({}) {
  const { id } = useParams() as { id: UUID };
  const searchParam = useSearchParams();
  return (
    <div className="flex flex-col justify-between">
      <div className="p-4">
        <div className="rounded-md border p-4 grid grid-cols-2 gap-4">
          <div className="bg-secondary rounded-md p-4">
            <div>
              <p className="text-sm text-muted-foreground">Vendor Name</p>
              <p className="text-base font-medium">Ram Bahadur</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Beneficiaries Selected
              </p>
              <p className="text-base font-medium">4</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vendor Vouchers</p>
              <p className="text-base font-medium">2000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total no. of Vouchers assigned
              </p>
              <p className="text-base font-medium">100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Voucher Numbers</p>
              <p className="text-base font-medium">400</p>
            </div>
          </div>
          <div className="rounded-md p-4">
            <p className="text-base font-medium">Beneficiary List</p>
            <p className="text-sm text-muted-foreground">
              40 Beneficiaries Selected
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
    </div>
  );
}
