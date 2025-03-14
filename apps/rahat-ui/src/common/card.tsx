'use client';
import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { cn } from '@rahat-ui/shadcn/src';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  address: UUID;
  title: string;
  subTitle: string;
  image: string;
  badge: string;
  status: string;
  key: string;
}

export default function CommonCard(props: CardProps) {
  const { className, address, title, subTitle, image, badge, status } = props;
  const router = useRouter();

  const handleClick = () => {
    // if(status === 'NOT_READY') return alert("Project not ready")
    router.push(`/projects/${badge.toLowerCase()}/${address}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(`cursor-pointer rounded-md border shadow`, className)}
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
        <p className="text-sm text-gray-500">{subTitle}</p>
      </CardContent>
    </Card>
  );
}
