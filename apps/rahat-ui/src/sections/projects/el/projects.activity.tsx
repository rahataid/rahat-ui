import { cn } from '@rahat-ui/shadcn/src';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
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
          <div className="space-y-1">
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.freeVoucherBudget}
              <span className="text-xs text-muted-foreground">{data?.freeVoucherCurrency} {(data?.freeVoucherBudget)*(data?.freeVoucherPrice)}</span>
            </div>
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.freeVoucherAssigned}{' '}
              <span className="text-xs text-muted-foreground">{data?.freeVoucherCurrency} {(data?.freeVoucherAssigned)*(data?.freeVoucherPrice)}</span>
            </div>
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.freeVoucherClaimed}
              <span className="text-xs text-muted-foreground">{data?.freeVoucherCurrency} {(data?.freeVoucherClaimed)*(data?.freeVoucherPrice)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Discount</p>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-sm text-muted-foreground">Assigned</p>
            <p className="text-sm text-muted-foreground">Reedemed</p>
          </div>
          <div className="space-y-1">
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.referredVoucherBudget}
              <span className="text-xs text-muted-foreground">{data?.referredVoucherCurrency} {(data?.referredVoucherBudget)*(data?.referredVoucherBudget)}</span>
            </div>
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.referredVoucherAssigned}{' '}
              <span className="text-xs text-muted-foreground">{data?.referredVoucherCurrency} {(data?.referredVoucherAssigned)*(data?.referredVoucherBudget)}</span>
            </div>
            <div className="ml-auto font-light text-sm flex items-center justify-between gap-3">
              {data?.referredVoucherClaimed}
              <span className="text-xs text-muted-foreground">{data?.referredVoucherCurrency} {(data?.referredVoucherClaimed)*(data?.referredVoucherBudget)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
