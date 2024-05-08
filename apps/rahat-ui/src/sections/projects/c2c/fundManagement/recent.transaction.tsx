import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function RecentTransaction() {
  return (
    <Card className="rounded mr-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex bg-green-200 flex items-center justify-center">
            <ArrowUp size={20} strokeWidth={1.25} />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contract address</p>
            <p className="text-sm text-muted-foreground">transaction_hash</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex bg-red-200 flex items-center justify-center">
            <ArrowDown size={20} strokeWidth={1.25} />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contract address</p>
            <p className="text-sm text-muted-foreground">transaction_hash</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex bg-green-200 flex items-center justify-center">
            <ArrowUp size={20} strokeWidth={1.25} />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contract address</p>
            <p className="text-sm text-muted-foreground">transaction_hash</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex bg-red-200 flex items-center justify-center">
            <ArrowDown size={20} strokeWidth={1.25} />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contract address</p>
            <p className="text-sm text-muted-foreground">transaction_hash</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex bg-green-200 flex items-center justify-center">
            <ArrowUp size={20} strokeWidth={1.25} />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contract address</p>
            <p className="text-sm text-muted-foreground">transaction_hash</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex bg-red-200 flex items-center justify-center">
            <ArrowDown size={20} strokeWidth={1.25} />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contract address</p>
            <p className="text-sm text-muted-foreground">transaction_hash</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex bg-green-200 flex items-center justify-center">
            <ArrowUp size={20} strokeWidth={1.25} />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contract address</p>
            <p className="text-sm text-muted-foreground">transaction_hash</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 sm:flex bg-red-200 flex items-center justify-center">
            <ArrowDown size={20} strokeWidth={1.25} />
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contract address</p>
            <p className="text-sm text-muted-foreground">transaction_hash</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
      </CardContent>
    </Card>
  );
}
