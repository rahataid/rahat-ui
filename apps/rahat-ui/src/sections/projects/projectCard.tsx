'use client';
import Image from 'next/image';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { useRouter } from 'next/navigation';

type CardProps = {
  id: number;
  title: string;
  subTitle: string;
  handleClick: VoidFunction;
};

export default function CommonCard({ id, title, subTitle }: CardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/projects/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer border-none shadow-sm`}
    >
      {' '}
      <CardContent>
        <Image src="/rahat-logo.png" alt="project" height={200} width={200} />
        <p className="font-bold text-md">{title} </p>
        <p className="text-sm">{subTitle}</p>
      </CardContent>
    </Card>
  );
}
