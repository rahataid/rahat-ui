import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Banknote, Plus, Users } from 'lucide-react';

export default function BeneficiaryGroupsView() {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

  return (
    <div className="p-4">
      <div className="rounded border bg-card p-4">
        <div className="flex justify-between space-x-2 mb-2">
          <SearchInput
            className="w-full"
            name="beneficiary"
            onSearch={() => {}}
          />

          <Button
            type="button"
            onClick={() =>
              router.push(
                `/projects/el-kenya/${id}/vouchers/bulk?benefGroup=true`,
              )
            }
          >
            <Plus size={18} className="mr-1" />
            Bulk Assign
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="cursor-pointer rounded-md border shadow p-4">
            <div className="flex flex-col space-y-2">
              <div className="rounded-md bg-secondary grid place-items-center h-28">
                <div className="bg-[#667085] text-white p-2 rounded-full">
                  <Users size={20} strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-base mb-1">Group Name Demo</p>
              <div className="text-muted-foreground text-sm flex justify-between">
                <div className="flex gap-2 items-center">
                  <Users size={18} strokeWidth={2} />
                  28
                </div>
                <div className="flex gap-2 items-center">
                  <Banknote size={18} strokeWidth={2} />
                  1000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
