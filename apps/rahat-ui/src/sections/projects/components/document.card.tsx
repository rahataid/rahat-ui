import { FilePreview } from 'apps/rahat-ui/src/common';
import { ViewIcon } from 'lucide-react';
import Link from 'next/link';

type IProps = {
  name: string;
  path: string;
};

export default function DocumentCard({ name, path }: IProps) {
  return (
    <div className="p-4 rounded border flex justify-between items-center">
      <div className="flex items-center gap-3">
        <FilePreview url={path} fileName={name} />
        <h1 className="text-primary font-medium">{name}</h1>
      </div>
      <Link
        href={path}
        target="_blank"
        className="p-1 rounded-full hover:bg-secondary"
      >
        <ViewIcon size={20} className="text-muted-foreground" />
      </Link>
    </div>
  );
}
