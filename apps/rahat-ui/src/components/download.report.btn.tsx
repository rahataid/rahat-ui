import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudDownload } from 'lucide-react';

type IProps = {
  handleDownload: VoidFunction;
};

export default function DownloadReportBtn({ handleDownload }: IProps) {
  return (
    <Button
      className="rounded"
      type="button"
      variant="outline"
      onClick={handleDownload}
    >
      <CloudDownload size={18} className="mr-1" />
      Download Report
    </Button>
  );
}
