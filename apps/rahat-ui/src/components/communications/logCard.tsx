import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Phone } from 'lucide-react';

type IProps = {
  title: string;
  total: number;
};

export default function LogCard({ total, title }: IProps) {
  return (
    <Card className='w-96 bg-secondary'>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <p>{total}</p>
          <Phone />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{title}</p>
      </CardContent>
    </Card>
  );
}
