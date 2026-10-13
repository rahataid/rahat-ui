import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@rahat-ui/shadcn/src/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { FilePreview } from './file.preview';

export type EvidenceItem = { mediaUrl: string; filename?: string };

/** info.mediaUrl is a legacy string (+ info.fileName) or [{ mediaUrl, filename }]. */
export function toEvidenceItems(info?: {
  mediaUrl?: string | EvidenceItem[];
  fileName?: string;
}): EvidenceItem[] {
  const media = info?.mediaUrl;
  if (!media) return [];
  if (typeof media === 'string')
    return [{ mediaUrl: media, filename: info?.fileName }];
  return Array.isArray(media) ? media.filter((m) => m?.mediaUrl) : [];
}

const isImage = (i: EvidenceItem) =>
  /\.(jpe?g|png|gif|webp|svg)$/i.test(
    (i.filename || i.mediaUrl).split('?')[0],
  );

function Slide({ item }: { item: EvidenceItem }) {
  const name = item.filename || item.mediaUrl.split('/').pop() || 'file';
  if (isImage(item))
    return (
      <img
        src={item.mediaUrl}
        alt={name}
        className="w-full h-[60vh] object-contain"
      />
    );
  if (/\.pdf$/i.test((item.filename || item.mediaUrl).split('?')[0]))
    return (
      <iframe src={item.mediaUrl} title={name} className="w-full h-[60vh]" />
    );
  return (
    <a
      href={item.mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-[60vh] items-center justify-center text-primary underline"
    >
      {name}
    </a>
  );
}

export function EvidenceGallery({ items }: { items: EvidenceItem[] }) {
  if (!items.length) return null;
  if (items.length === 1)
    return (
      <FilePreview
        url={items[0].mediaUrl}
        fileName={items[0].filename ?? ''}
      />
    );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="relative w-10 h-10">
          {isImage(items[0]) ? (
            <img
              src={items[0].mediaUrl}
              alt={items[0].filename}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <span className="flex w-10 h-10 items-center justify-center rounded bg-secondary" />
          )}
          <span className="absolute -bottom-1 -right-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
            +{items.length - 1}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogTitle>Evidence ({items.length})</DialogTitle>
        <Carousel className="mx-10">
          <CarouselContent>
            {items.map((item, i) => (
              <CarouselItem key={`${item.mediaUrl}-${i}`}>
                <Slide item={item} />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {item.filename} · {i + 1}/{items.length}
                </p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
