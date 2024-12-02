import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import HeaderWithBack from '../../components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import AddButton from '../../components/add.btn';
import { useListRpCampaign, usePagination } from '@rahat-ui/query';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { Pencil } from 'lucide-react';

export default function ManageTexts() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const { pagination, filters } = usePagination();

  const { data: campaignData } = useListRpCampaign(id as UUID, {
    ...pagination,
    ...(filters as any),
    order: 'desc',
  });
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Manage Texts"
          subtitle="Here is list of all the text messages"
          path={`/projects/el-kenya/${id}/communication`}
        />
        <AddButton
          name="SMS"
          path={`/projects/el-kenya/${id}/communication/add`}
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {campaignData?.map((i, index) => {
          return (
            <div
              key={index}
              className="border rounded-sm p-4 cursor-pointer"
              onClick={() =>
                router.push(`/projects/el-kenya/${id}/communication/${i.uuid}`)
              }
            >
              <div className="flex justify-between items-center z-100">
                <h1 className="mb-4 text-lg font-medium">{i.name}</h1>
                {!i.sessionId && (
                  <TooltipComponent
                    handleOnClick={(event) => {
                      event.stopPropagation(); // Prevent triggering the main div's onClick
                      router.push(
                        `/projects/el-kenya/${id}/communication/edit/${i.uuid}`,
                      );
                    }}
                    Icon={Pencil}
                    tip="Edit"
                  />
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-sm text-muted-foreground">Status</h1>
                  <Badge className="font-normal">
                    {i.sessionId ? 'COMPLETED' : 'ONGOING'}
                  </Badge>
                </div>
                <div>
                  <h1 className="text-sm text-muted-foreground">Triggers</h1>
                  <p className="text-primary text-base">
                    {i.sessionId ? 1 : 0}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
