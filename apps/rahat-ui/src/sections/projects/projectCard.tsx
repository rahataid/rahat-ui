'use client';
import Image from 'next/image';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { UUID } from 'crypto';
import { TruncatedCell } from './aa-2/stakeholders/component/TruncatedCell';
import { TooltipText } from '../../components/tootltip.text';
import { StatusBadge } from './projectList';
import { toast } from 'react-toastify';

type CardProps = {
  address: UUID;
  title: string;
  subTitle: string;
  image: string;
  badge: string;
  status: string;
  isPinned?: boolean;
  onTogglePin?: () => void;
  hidePin?: boolean;
};

export default function CommonCard({
  address,
  title,
  subTitle,
  image,
  badge,
  status,
  isPinned = false,
  onTogglePin,
  hidePin = false,
}: CardProps) {
  const router = useRouter();

  const isNotReady = status === 'NOT_READY';

  const handleClick = () => {
    if (isNotReady) {
      toast.warn('This project is not ready yet. You cannot enter into it.');
      return;
    }
    router.push(`/projects/${badge.toLowerCase()}/${address}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="rounded-md border shadow  cursor-pointer"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3 gap-2">
          <TooltipText
            title={title}
            content={title}
            titleClassName="font-bold text-l text-foreground w-full min-w-0 flex-1"
          />
          {!hidePin && (
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin?.();
              }}
              className="mt-1 p-0 bg-transparent w-6 h-6"
            >
              {isPinned ? (
                <Image
                  src="/svg/pin-on.svg"
                  alt="Unpin project"
                  title="Unpin project"
                  className="w-5 h-5 cursor-pointer active:scale-95 transition-transform"
                  width={25}
                  height={25}
                />
              ) : (
                <Image
                  src="/svg/pin-off.svg"
                  alt="Pin project"
                  title="Pin project"
                  className="w-5 h-5 cursor-pointer active:scale-95 transition-transform"
                  width={25}
                  height={25}
                />
              )}
            </Button>
          )}
        </div>
        <div className="rounded-md border bg-secondary flex justify-center mb-3 overflow-hidden">
          <Image
            className="object-cover w-full h-[180px]"
            src={image}
            alt="project"
            height={200}
            width={400}
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className="border-primary text-primary cursor-auto bg-secondary"
          >
            {badge}
          </Badge>
          <StatusBadge status={status} />
        </div>
        <div>
          <TruncatedCell
            text={subTitle}
            maxLength={40}
            className="text-sm text-gray-500 w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
