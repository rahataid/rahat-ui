import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import { CloudDownload } from "lucide-react";

type IProps = {
    handleDownload: VoidFunction;
}

export default function DownloadReportBtn({ handleDownload }: IProps) {
    return (
        <Button
            type="button"
            variant="outline"
            className="shadow-md"
            onClick={handleDownload}
        >
            <CloudDownload size={18} className="mr-1" />
            Download Report
        </Button>
    )
}