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
  console.log(image);

  const handleClick = () => {
    router.push(`/projects/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer border-none shadow-sm`}
    >
      {' '}
      <Image
        className="object-cover h-48 w-full rounded-t"
        src={image}
        alt="project"
        height={200}
        width={200}
      />
      <CardContent className="pt-3 pb-3">
        <p className="font-bold text-md text-primary">{title} </p>
        <p className="text-sm text-gray-500">{subTitle}</p>
      </CardContent>
    </Card>
  );
}
