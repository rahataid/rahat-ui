'use client';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CardProps = {
  address: string;
  title: string;
  subTitle: string;
  image: string;
  badge: string;
  status: string;
};

export default function CommonCard({ address, title, image }: CardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/offramp/${address}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer rounded border shadow`}
    >
      <div className="rounded">
        <Image
          className="object-contain h-36 w-full rounded-t m-3"
          src={image}
          alt="project"
          height={100}
          width={100}
        />
      </div>
      <CardContent className="pt-4 pb-4 border-t">
        <div className="flex justify-between">
          <p className="font-bold text-md text-primary">{title} </p>
        </div>
      </CardContent>
    </Card>
  );
}
