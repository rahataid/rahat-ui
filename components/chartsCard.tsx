import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';

type CardProps = {
  title: string;
  image: string;
  className: string;
};

export default function ChartsCard({ title, image, className }: CardProps) {
  return (
    <Card className={cn('flex flex-col justify-center', className || '')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={image} height={400} width={300} alt="charts" />
      </CardContent>
    </Card>
  );
}
