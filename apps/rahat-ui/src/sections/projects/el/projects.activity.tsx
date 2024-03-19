import { cn } from '@rahat-ui/shadcn/src';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
type CardProps = {
  title: string;
  image?: string;
  className?: string;
  data?: any;
};

export default function Activities({ title, className, data }: CardProps) {
  return (
    <Card className={cn('border-none shadow-sm', className || '')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Free</p>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-sm text-muted-foreground">Assigned</p>
            <p className="text-sm text-muted-foreground">Reedemed</p>
          </div>
          <div>
            <div className="ml-auto font-light text-sm">
              {' '}
              {data?.freeVoucherBudget}{' '}
            </div>
            <p className="text-xs text-muted-foreground">$5</p>
            <div className="ml-auto font-light text-sm">
              {' '}
              {data?.freeVoucherAssigned}{' '}
            </div>
            <p className="text-xs text-muted-foreground">$5</p>
            <div className="ml-auto font-light text-sm">
              {' '}
              {data?.freeVoucherClaimed}{' '}
            </div>
            <p className="text-xs text-muted-foreground">$5</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Discount</p>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-sm text-muted-foreground">Assigned</p>
            <p className="text-sm text-muted-foreground">Reedemed</p>
          </div>
          <div>
            <div className="ml-auto font-light text-sm">
              {' '}
              {data?.refeeredVoucherBudget}{' '}
            </div>
            <p className="text-xs text-muted-foreground">$1,999.00</p>
            <div className="ml-auto font-light text-sm">
              {' '}
              {data?.refeeredVoucherAssigned}{' '}
            </div>
            <p className="text-xs text-muted-foreground">$5</p>
            <div className="ml-auto font-light text-sm">
              {' '}
              {data?.refeeredVoucherClaimed}{' '}
            </div>
            <p className="text-xs text-muted-foreground">$1,999.00</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
