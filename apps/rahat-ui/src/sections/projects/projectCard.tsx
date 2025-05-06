'use client';
import Image from 'next/image';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { UUID } from 'crypto';

type CardProps = {
  address: UUID;
  title: string;
  subTitle: string;
  image: string;
  badge: string;
  status: string;
};

export default function CommonCard({
  address,
  title,
  subTitle,
  image,
  badge,
  status,
}: CardProps) {
  const router = useRouter();

  const handleClick = () => {
    // if(status === 'NOT_READY') return alert("Project not ready")
    router.push(`/projects/${badge.toLowerCase()}/${address}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer rounded-sm border shadow`}
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
        <p className="font-bold text-md text-primary mb-1">{title} </p>
        <Badge
          variant="outline"
          className="border-primary text-primary cursor-auto bg-secondary mb-2"
        >
          {badge}
        </Badge>
        <p className="text-sm text-gray-500 line-clamp-2">{subTitle}</p>
      </CardContent>
    </Card>
  );
}
