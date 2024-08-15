import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { X } from 'lucide-react';

type IProps = {
  close: VoidFunction;
};

export default function CommsActivitySplitView({ close }: IProps) {
  return (
    <div className="p-4">
      <div>
        <X size={20} strokeWidth={1.5} onClick={() => close()} />
        <Button variant="ghost" type="button" className="text-primary">
          View all
        </Button>
      </div>
    </div>
  );
}
