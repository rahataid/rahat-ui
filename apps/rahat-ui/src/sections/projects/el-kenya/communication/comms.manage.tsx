import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import HeaderWithBack from '../../components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import AddButton from '../../components/add.btn';

const cardData = [
  {
    uuid: 'ab89-d8d-d9d9d-dd',
    title: 'This is a test SMS',
    status: 'Completed',
    triggers: 24,
  },
  {
    uuid: 'ab89-d8d-d9d9d-dd',
    title: 'This is a test SMS',
    status: 'Completed',
    triggers: 24,
  },
  {
    uuid: 'ab89-d8d-d9d9d-dd',
    title: 'This is a test SMS',
    status: 'Completed',
    triggers: 24,
  },
  {
    uuid: 'ab89-d8d-d9d9d-dd',
    title: 'This is a test SMS',
    status: 'Completed',
    triggers: 24,
  },
  {
    uuid: 'ab89-d8d-d9d9d-dd',
    title: 'This is a test SMS',
    status: 'Completed',
    triggers: 24,
  },
  {
    uuid: 'ab89-d8d-d9d9d-dd',
    title: 'This is a test SMS',
    status: 'Completed',
    triggers: 24,
  },
];

export default function ManageTexts() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
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
        {cardData?.map((i, index) => {
          return (
            <div
              key={index}
              className="border rounded-sm p-4 cursor-pointer"
              onClick={() =>
                router.push(`/projects/el-kenya/${id}/communication/${i.uuid}`)
              }
            >
              <h1 className="mb-4 text-lg font-medium">{i.title}</h1>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-sm text-muted-foreground">Status</h1>
                  <Badge className="font-normal">{i.status}</Badge>
                </div>
                <div>
                  <h1 className="text-sm text-muted-foreground">Triggers</h1>
                  <p className="text-primary text-base">{i.triggers}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
