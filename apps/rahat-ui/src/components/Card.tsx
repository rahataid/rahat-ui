import Image from 'next/image';
import { Card, CardContent } from './ui/card';

type CardProps = {
  title: string;
  subTitle: string;
  handleClick: VoidFunction;
};

export default function CommonCard({
  title,
  subTitle,
  handleClick,
}: CardProps) {
  return (
    <Card onClick={handleClick} className={`cursor-pointer`}>
      <CardContent>
        <Image src="/rahat-logo.png" alt="project" height={200} width={200} />
        <p className="font-bold text-md">{title} </p>
        <p className="text-sm">{subTitle}</p>
      </CardContent>
    </Card>
  );
}
