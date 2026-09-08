'use client';

import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { InkindTabs } from './components';
import { useInkinds } from '@rahat-ui/query';
import { UUID } from 'crypto';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Can } from 'apps/rahat-ui/src/components/can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';

export default function InKindManagementView() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  // Query goes here
  const { data } = useInkinds(id as UUID, {
    page: 0 + 1,
    perPage: 10,
    order: 'desc',
    sort: 'createdAt',
  });

  const isInkindDataAvailable = !!data?.data.length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Inkind Management"
          description="Track all inkind items and stock movements here"
        />
        <Can action={ACTIONS.CREATE} subject={SUBJECTS.INKIND}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <IconLabelBtn
                    Icon={Plus}
                    handleClick={() =>
                      router.push(`/projects/aa/${id}/inkind-management/assign?tab=${tab}`)
                    }
                    name="Assign Inkind"
                    disabled={!isInkindDataAvailable}
                  />
                </span>
              </TooltipTrigger>
              { !isInkindDataAvailable && (
                <TooltipContent>
                  You must have at least one inkind item to assign.
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </Can>
      </div>
      <InkindTabs />
    </div>
  );
}
