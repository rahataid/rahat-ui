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

export default function CommingSoonCard({
  address,
  title,
  image,
  badge,
}: CardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`#`);
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-not-allowed rounded border shadow`}
    >
      <div className="relative rounded">
        <span className="absolute top-0 right-0 bg-sky-400 text-white px-4 py-1 rounded-l-lg text-sm font-medium">
          {'Coming Soon !!!'}
        </span>

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
          <p className="font-bold text-md text-primary">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
