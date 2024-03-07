import { cn } from '@rahat-ui/shadcn/src/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import Image from 'next/image';

type CardProps = {
  title: string;
  image: string;
  className?: string;
};

export default function ChartsCard({ title, image, className }: CardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col justify-center border-none shadow-sm',
        className || ''
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="place-content-center">
        <Image
          src={image}
          height={400}
          width={300}
          alt="charts"
          className="justify-self-center"
        />
      </CardContent>
    </Card>
  );
}
