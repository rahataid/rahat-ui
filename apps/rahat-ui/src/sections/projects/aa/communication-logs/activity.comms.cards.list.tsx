import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Download, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type IProps = {
  comms: any;
};

export default function ActivityCommsCards({ comms }: IProps) {
  const { id: projectId } = useParams();

  const CommCard = () => {
    return (
      <div className="p-4 rounded-md border">
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-primary">Group Name</h1>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <h1 className="text-muted-foreground text-sm">Group Type</h1>
            <p>-</p>
          </div>
          <div className="text-right">
            <h1 className="text-muted-foreground text-sm">Communication</h1>
            <p>-</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">Message</h1>
            <p>-</p>
          </div>
        </div>
        <div className="flex justify-between items-center space-x-2 mt-2">
          <Link
            href={`/projects/aa/${projectId}/communication-logs/1`}
            className="w-full"
          >
            <Button
              type="button"
              variant="secondary"
              className="w-full hover:bg-[#E1ECF9] text-primary"
            >
              <Eye className="mr-2" size={16} strokeWidth={2} />
              <span className="font-normal">View</span>
            </Button>
          </Link>
          <Button type="button" className="w-full">
            <Download className="mr-2" size={16} strokeWidth={2} />
            <span className="font-normal">Failed Exports</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="grid gap-2">
        {comms?.map((comm: any, index: number) => (
          <CommCard key={index} />
        ))}
      </div>
    </ScrollArea>
  );
}
