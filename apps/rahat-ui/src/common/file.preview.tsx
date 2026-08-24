import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/src/components/ui/hover-card';
import { File, FileSpreadsheet, FileText } from 'lucide-react';

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const SHEET_EXT = ['xls', 'xlsx', 'csv'];
const DOC_EXT = ['doc', 'docx'];

function getExt(source: string) {
  return source?.split('?')[0].split('.').pop()?.toLowerCase() || '';
}

function getIcon(ext: string) {
  if (SHEET_EXT.includes(ext)) return FileSpreadsheet;
  if (DOC_EXT.includes(ext) || ext === 'pdf') return FileText;
  return File;
}

type FilePreviewProps = {
  url: string;
  fileName: string;
  className?: string;
};

export function FilePreview({ url, fileName, className }: FilePreviewProps) {
  const ext = getExt(fileName) || getExt(url);
  const isImage = IMAGE_EXT.includes(ext);
  const isPdf = ext === 'pdf';
  const hasFullPreview = isImage || isPdf;
  const Icon = getIcon(ext);

  return (
    // stops clicks (incl. Dialog portal, which bubbles via React tree not DOM) from reaching a card-level onClick
    <div className="contents" onClick={(e) => e.stopPropagation()}>
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {isImage ? (
            <img
              src={url}
              alt={fileName}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-primary">
              <Icon size={20} />
            </div>
          )}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-2">
        {isImage ? (
          <img
            src={url}
            alt={fileName}
            className="w-full h-48 object-contain rounded"
          />
        ) : isPdf ? (
          // ponytail: native browser pdf viewer, no react-pdf dep
          <embed
            src={`${url}#page=1&view=Fit`}
            type="application/pdf"
            className="w-full h-48 rounded"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
            <Icon size={32} />
            <span className="text-xs">No preview available</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-1 gap-2">
          <p className="text-xs truncate">{fileName}</p>
          {hasFullPreview && (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-xs text-primary underline shrink-0"
                >
                  Full Preview
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
                <DialogTitle className="truncate pr-6">
                  {fileName}
                </DialogTitle>
                <div className="flex-1 overflow-auto">
                  {isImage ? (
                    <img
                      src={url}
                      alt={fileName}
                      className="w-full h-auto"
                    />
                  ) : (
                    <iframe
                      src={url}
                      title={fileName}
                      className="w-full h-full"
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
    </div>
  );
}
