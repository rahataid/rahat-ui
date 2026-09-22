'use client';

import { useTranslations } from 'next-intl';
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
  const tv = useTranslations('AA_PROJECT_WITH_GNOSIS');
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
          title={tv('INKIND_MANAGEMENT')}
          description={tv('TRACK_ALL_INKIND_ITEMS_AND_STOCK')}
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
                    name={tv('ASSIGN_INKIND')}
                    disabled={!isInkindDataAvailable}
                  />
                </span>
              </TooltipTrigger>
              { !isInkindDataAvailable && (
                <TooltipContent>
                  {tv('YOU_MUST_HAVE_AT_LEAST_ONE')}
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
