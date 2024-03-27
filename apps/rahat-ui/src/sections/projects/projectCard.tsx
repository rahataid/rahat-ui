'use client';
import Image from 'next/image';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type CardProps = {
  address: string;
  title: string;
  subTitle: string;
  image: string;
  badge: string;
};

export default function CommonCard({
  address,
  title,
  subTitle,
  image,
  badge,
}: CardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/projects/${badge.toLowerCase()}/${address}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer rounded border shadow`}
    >
      <div className="bg-black rounded">
        <Image
          className="object-cover h-72 w-full rounded-t opacity-70"
          src={image}
          alt="project"
          height={200}
          width={200}
        />
      </div>
      <CardContent className="pt-4 pb-4">
        <div className="flex justify-between">
          <p className="font-bold text-md text-primary">{title} </p>
          <Badge
            variant="outline"
            className="border-primary text-primary cursor-auto bg-secondary"
          >
            {badge}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">{subTitle}</p>
      </CardContent>
    </Card>
  );
}
