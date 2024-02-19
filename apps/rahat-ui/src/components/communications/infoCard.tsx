import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

export default function InfoCard() {
  return (
    <Card className='shadow-md'>
      <CardHeader>
        <CardTitle>Voice Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <p>PHONE</p>
            <p className="text-sm font-light">Type</p>
          </div>
          <div>
            <p>16 Fec, 2024 12:00 AM</p>
            <p className="text-sm font-light">Start Time</p>
          </div>
          <div>
            <p>ONGOING</p>
            <p className="text-sm font-light">Status</p>
          </div>
          <div>
            <p>4</p>
            <p className="text-sm font-light">Total Audiences</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
