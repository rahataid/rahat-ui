'use client';
import Image from 'next/image';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { useRouter } from 'next/navigation';

type CardProps = {
  id: number;
  title: string;
  subTitle: string;
  image: string;
  handleClick: VoidFunction;
};

export default function CommonCard({ id, title, subTitle, image }: CardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/projects/${id}`);
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
        <p className="font-bold text-md text-primary">{title} </p>
        <p className="text-sm text-gray-500">{subTitle}</p>
      </CardContent>
    </Card>
  );
}
