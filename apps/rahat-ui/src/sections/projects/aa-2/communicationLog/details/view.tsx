import { useSingleActivity } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Back, Heading, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { CommunicationDetailCard } from './communication.card';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
const activityDetail = {
  id: 4,
  uuid: '7b21ae50-41e2-4d68-8ba1-0b127f5d5af1',
  app: 'fce687ec-c89e-4063-bf5f-9b965d7e22ac',
  title: 'Release the fund AASAP',
  leadTime: '2023-01-01',
  phaseId: '5f428423-80a6-4d86-a282-e98d76b727ec',
  categoryId: '01de4432-c4df-43c5-9266-597a4595c6e7',
  managerId: 'adfasdfasdf',
  description: 'This is for testing document description',
  notes: null,
  status: 'NOT_STARTED',
  activityDocuments: [
    {
      fileName: '1743837385472-diagram-export-4-1-2025-2_50_01-PM.png',
      mediaURL:
        'https://rahat-rumsan.s3.us-east-1.amazonaws.com/aa/dev/QmToBxJLodxMYPMfi3wFPbbNzCtbah7Hqo79uegfTvLPY8',
    },
    {
      fileName: '1743837409317-diagram-export-4-1-2025-2_51_13-PM.png',
      mediaURL:
        'https://rahat-rumsan.s3.us-east-1.amazonaws.com/aa/dev/QmaUXRkrrP7nJnQgTP1N2g3q5z3TEuzcYEyFSvdQGYwqQZ',
    },
  ],
  activityPayout: [],
  isAutomated: false,
  isDeleted: false,
  completedBy: 'ram',
  completedAt: null,
  differenceInTriggerAndActivityCompletion: null,
  createdAt: '2025-04-05T07:18:03.703Z',
  updatedAt: '2025-04-05T07:18:03.703Z',
  category: {
    id: 1,
    uuid: '01de4432-c4df-43c5-9266-597a4595c6e7',
    app: 'fce687ec-c89e-4063-bf5f-9b965d7e22ac',
    name: 'Cleaning The Drains',
    isDeleted: false,
    createdAt: '2025-04-04T05:15:17.286Z',
    updatedAt: '2025-04-04T05:15:17.286Z',
  },
  phase: {
    id: 3,
    uuid: '5f428423-80a6-4d86-a282-e98d76b727ec',
    name: 'PREPAREDNESS',
    activeYear: '2024',
    requiredMandatoryTriggers: 0,
    requiredOptionalTriggers: 0,
    receivedMandatoryTriggers: 1,
    receivedOptionalTriggers: 0,
    canRevert: false,
    canTriggerPayout: false,
    isActive: false,
    riverBasin: 'Karnali at Chisapani',
    activatedAt: null,
    createdAt: '2025-04-04T04:28:10.718Z',
    updatedAt: '2025-04-04T07:34:20.739Z',
    source: {
      id: 1,
      uuid: 'e4a1904b-fb8c-4452-b7a8-28278e179cb2',
      source: ['DHM'],
      riverBasin: 'Karnali at Chisapani',
      createdAt: '2025-04-03T11:49:53.465Z',
      updatedAt: '2025-04-03T11:49:53.465Z',
    },
  },
  manager: {
    id: 'adfasdfasdf',
    name: 'test',
    email: 'test@gmail.com',
    phone: '9801234567',
    createdAt: '2025-04-04T06:59:46.536Z',
    updatedAt: '2025-04-04T06:59:46.536Z',
  },
  activityCommunication: [
    {
      groupId: '68e0d421-b358-4a3d-aef0-dbf84264602f',
      message: 'This is a test email. ',
      groupType: 'STAKEHOLDERS',
      sessionId: 'dhwyp9h9kffyh7x86xgofrtb',
      transportId: 'yp9gn0pahyy69hc0vjhi39h0',
      communicationId: '757ac475-239c-4bb5-ab79-5e116a85475c',
      groupName: 'informers',
      transportName: 'SMS',
      sessionStatus: 'PENDING',
    },
    {
      groupId: 'e97998ed-8577-4a03-ab90-65ed9157ee1e',
      sessionId: 'dhwyp9h9kffyh7x86xgofrtc',
      message: {
        fileName: 'file_example_MP3_700KB.mp3',
        mediaURL:
          'https://rahat-rumsan.s3.us-east-1.amazonaws.com/aa/dev/QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      },
      groupType: 'STAKEHOLDERS',
      transportId: 'i206fgnnpxzr4y4ts9qtrj0y',
      communicationId: '0de299de-16df-4af8-8788-b716b07672ea',
      transportName: 'IVR',
      groupName: 'informers',
      sessionStatus: 'FAILED',
    },
    {
      groupId: '43835e86-dd8a-4f63-baaf-2838ac303d86',
      message: {},
      groupType: 'BENEFICIARY',
      transportId: 'i206fgnnpxzr4y4ts9qtrj0y',
      sessionId: 'dhwyp9h9kffyh7x86xgofrtd',
      communicationId: 'ecf6c1fe-85eb-4a91-80ed-4cf275ae9b87',
      transportName: 'IVR',
      groupName: 'informers',
      sessionStatus: 'COMPLETE',
    },
  ],
};
const CommunicationDetailsView = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const activityId = params.activityId as UUID;

  const { data: activityDetail, isLoading } = useSingleActivity(
    projectId,
    activityId,
  );

  function getPhaseColor(phase: string) {
    if (phase === 'PREPAREDNESS') {
      return 'bg-green-100 text-green-500';
    }
    if (phase === 'ACTIVATION') {
      return 'bg-red-100 text-red-500';
    }
    if (phase === 'READINESS') {
      return 'bg-yellow-100 text-yellow-500';
    }
    return '';
  }
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectId}/communication-logs`} />

        <div className="mt-4 flex flex-col pb-3">
          <div>
            <Heading
              title={`Communication Details`}
              description="Select any communication to view  their details"
            />
          </div>
          <div className="flex flex-col">
            {/* <p className="text-sm text-muted-foreground">Activity title:</p> */}
            <Label className="text-muted-foreground mb-2 text-xs">
              Activity Title:
            </Label>
            <p className="text-base">
              {activityDetail?.title}{' '}
              <span>
                <Badge className={getPhaseColor(activityDetail?.phase?.name)}>
                  {activityDetail?.phase?.name}
                </Badge>
              </span>
            </p>
          </div>
        </div>

        {isLoading ? (
          <SpinnerLoader className="w-10 h-10" />
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid  grid-cols-1 lg:grid-cols-2 gap-3">
              {activityDetail?.activityCommunication?.map((comm: any) => (
                <CommunicationDetailCard
                  key={comm.communicationId}
                  activityCommunication={comm}
                  activityId={activityId}
                  projectId={projectId}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
export default CommunicationDetailsView;
