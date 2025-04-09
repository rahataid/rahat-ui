import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { File } from 'lucide-react';

interface DocumentCardProps {
  fileName: string;
  date?: string;
  mediaURL?: string;
}

export default function DocumentCard({
  fileName,
  date,
  mediaURL,
}: DocumentCardProps) {
  return (
    <div
      className="bg-white shadow-sm rounded-xl p-2 border border-gray-200 flex items-center gap-3 hover:cursor-pointer hover:bg-gray-100"
      onClick={() => window.open(mediaURL, '_blank')}
    >
      <div className="bg-gray-100 p-2 rounded-sm">
        <File />
      </div>
      <div>
        <h4 className="text-gray-900 font-medium truncate w-56">{fileName}</h4>
        <p className="text-gray-500 text-sm">{date}</p>
      </div>
    </div>
  );
}

interface DocumentListProps {
  documents: DocumentCardProps[];
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 h-[45vh]">
      <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
      <p className="text-gray-600 text-sm mb-4">
        List of all the uploaded documents
      </p>
      <ScrollArea className="h-[calc(100vh-600px)]">
        <div className="grid grid-cols-2 gap-4 p-4">
          {documents?.map((doc, index) => (
            <DocumentCard key={index} {...doc} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
