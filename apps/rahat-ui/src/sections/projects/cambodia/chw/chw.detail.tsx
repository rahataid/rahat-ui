import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import Back from '../../components/back';
import { useParams } from 'next/navigation';
import { useCHWGet } from '@rahat-ui/query';

export default function ChwDetail() {
  const { id, chwId } = useParams();
  console.log(chwId);
  const { data } = useCHWGet({ projectUUID: id, chwId: chwId as string });

  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex space-x-3 mb-10">
        <Back path={`/projects/el-cambodia/${id}/chw`} />
        <div>
          <h1 className="text-2xl font-semibold">Beneficiary details</h1>
          <p className=" text-muted-foreground">
            Here is the detailed view of selected beneficiary
          </p>
        </div>
      </div>
      <div className="p-5 rounded border grid grid-cols-4 gap-5">
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Name</h1>
          <p className="font-medium">John Doe</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Gender</h1>
          <p className="font-medium">Male</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">+9779876543210</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Address</h1>
          <p className="font-medium">Ktm</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Type</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Eye Checkup Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Glasses Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Voucher Type</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Voucher Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
      </div>
    </div>
  );
}
