'use client';
import Image from 'next/image';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { UUID } from 'crypto';
import { TruncatedCell } from './aa-2/stakeholders/component/TruncatedCell';

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

  const handleClick = () => {
    router.push(`/projects/${badge.toLowerCase()}/${address}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer rounded-md border shadow`}
    >
      <div className="p-4">
        <div className="rounded-md bg-secondary flex justify-center">
          <Image
            className="object-contain"
            src={image}
            alt="project"
            height={200}
            width={200}
          />
        </div>
      </div>
      <CardContent>
        <div className="flex items-start justify-between">
          <p className="font-bold text-md text-primary mb-1">{title}</p>
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
        <Badge
          variant="outline"
          className="border-primary text-primary cursor-auto bg-secondary mb-2"
        >
          {badge}
        </Badge>
        <div>
          <TruncatedCell
            text={subTitle}
            maxLength={40}
            className="text-sm text-gray-500 w-[300px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
