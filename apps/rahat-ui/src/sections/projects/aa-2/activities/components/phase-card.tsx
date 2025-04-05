'use client';

import { cn } from '@rahat-ui/shadcn/src';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { RefreshCw, User } from 'lucide-react';

interface PhaseCardProps {
  status: string;
  title: string;
  location: string;
  leadTime: string;
  responsibility: string;
  onUpdateStatus?: () => void;
  className?: string;
}

export default function PhaseCard({
  status,
  title,
  location,
  leadTime,
  responsibility,
  onUpdateStatus,
  className,
}: PhaseCardProps) {
  return (
    <Card
      className={(cn(' border-gray-300 shadow-sm p-4 rounded-xl '), className)}
    >
      <CardContent className="space-y-2 p-2">
        <div className="flex items-center justify-between ">
          <Badge className="bg-gray-200 text-gray-700 font-normal">
            {status}
          </Badge>
          <div
            className="flex items-center gap-2 text-blue-500"
            onClick={onUpdateStatus}
          >
            Update Status <RefreshCw className="w-4 h-4" />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-900 truncate w-96">
          {title}
        </p>
        <p className="text-sm text-gray-500">
          {location ?? ''} • {leadTime}
        </p>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <div className="flex items-center gap-2 p-0">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">{responsibility ?? ''}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
