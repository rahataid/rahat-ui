import { useRouter, useParams } from 'next/navigation';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowLeft, ArchiveRestore, Pencil } from 'lucide-react';
import TriggerDetailCards from './trigger.detail.cards';
import TriggerDetailCard from './trigger.detail.card';
import TriggerActivityListCard from './trigger.activity.list.card';
import { useSingleTriggerStatement } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function TriggerStatementsDetailView() {
  const { id: projectID } = useParams();
  const router = useRouter();
  const triggerRepeatKey = window.location.href.split("/").slice(-1)[0]
  const { data: triggerDetail } = useSingleTriggerStatement(
    projectID as UUID,
    triggerRepeatKey,
  );

  return (
    <div className="h-[calc(100vh-65px)] bg-secondary p-4">
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <ArrowLeft
            size={25}
            strokeWidth={1.5}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-semibold">{triggerDetail?.title}</h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="rounded-full border border-primary text-primary bg-card p-2">
            <Pencil size={20} strokeWidth={1.5} />
          </div>
          <div className="rounded-full border border-red-500 text-red-500 bg-card p-2">
            <ArchiveRestore size={20} strokeWidth={1.5} />
          </div>
          <Button type="button" className="px-8">
            Trigger
          </Button>
        </div>
      </div>
      <TriggerDetailCards triggerDetail={triggerDetail} />
      <div className="grid grid-cols-2 gap-4 mt-4 h-[calc(100vh-252px)]">
        <TriggerDetailCard triggerDetail={triggerDetail} />
        <TriggerActivityListCard triggerDetail={triggerDetail} />
      </div>
    </div>
  );
}
