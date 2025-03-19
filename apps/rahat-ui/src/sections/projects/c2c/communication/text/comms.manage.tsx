import { UUID } from 'crypto';
import { Pencil } from 'lucide-react';
import AddButton from '../../../components/add.btn';
import { useParams, useRouter } from 'next/navigation';
import HeaderWithBack from '../../../components/header.with.back';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  useListc2cCampaign,
  useListRpTransport,
  usePagination,
} from '@rahat-ui/query';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export default function ManageTexts() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data: transportData } = useListRpTransport(id as UUID);

  const transportId = transportData?.find(
    (transport) => transport.name === process.env.NEXT_PUBLIC_SMS_TRANSPORT,
  )?.cuid;

  const { data: campaignData, meta } = useListc2cCampaign(id as UUID, {
    ...pagination,
    ...(filters as any),
    order: 'desc',
    transportId: transportId,
  });
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Manage Texts"
          subtitle="Here is list of all the text messages"
          path={`/projects/c2c/${id}/communication/text`}
        />
        <AddButton
          name="SMS"
          path={`/projects/c2c/${id}/communication/text/add`}
        />
      </div>
      <ScrollArea className="h-[calc(100vh-230px)]">
        <div className="grid grid-cols-4 gap-4">
          {campaignData?.map((i, index) => {
            return (
              <div
                key={index}
                className="border rounded-sm p-4 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/projects/c2c/${id}/communication/text/${i.uuid}`,
                  )
                }
              >
                <div className="flex justify-between items-center z-100">
                  <h1 className="mb-4 text-lg font-medium">{i.name}</h1>
                  {!i.sessionId && (
                    <TooltipComponent
                      handleOnClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the main div's onClick
                        router.push(
                          `/projects/c2c/${id}/communication/text/edit/${i.uuid}`,
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
      </ScrollArea>
      <CustomPagination
        meta={meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </div>
  );
}
