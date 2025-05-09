import { Heading } from 'apps/rahat-ui/src/common';
import { File } from 'lucide-react';
import Link from 'next/link';

type IProps = {
  triggerDocuments: any[];
  date: string;
};

export function DocumentsSection({ triggerDocuments, date }: IProps) {
  return (
    <div className="p-4 border rounded-sm shadow">
      <Heading
        title="Document"
        titleStyle="text-lg/7"
        description="List of all the uploaded documents"
      />
      <div className="grid grid-cols-2 gap-3">
        {triggerDocuments?.map((d: any) => (
          <Link
            href={d.mediaURL}
            target="_blank"
            className="p-4 rounded-sm shadow border flex gap-2 items-center hover:shadow-md"
          >
            <div className="rounded-sm bg-gray-100 p-2">
              <File size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm/6 truncate">{d.fileName}</p>
              <p className="text-sm/4 text-muted-foreground">
                {new Date(date).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
