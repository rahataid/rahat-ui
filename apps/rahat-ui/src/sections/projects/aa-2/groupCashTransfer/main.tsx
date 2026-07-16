'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { UUID } from 'crypto';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { GctTabs } from './components';

// ─── View ─────────────────────────────────────────────────────────────────────

export default function GroupCashTransferView() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Group Cash Transfer"
          description="Track all the GCT Group in the project"
        />
        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.Municipality]}
          hasContent={false}
        >
          <IconLabelBtn
            Icon={Plus}
            handleClick={() =>
              router.push(`/projects/aa/${id}/group-cash-transfer/add`)
            }
            name="Create GCT Group"
          />
        </RoleAuth>
      </div>

      {/* Tabs: GCT Group List / GCT Management List */}
      <GctTabs />
    </div>
  );
}
