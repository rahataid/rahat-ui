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
  description: string;
  location: string;
  leadTime: string;
  userName: string;
  onUpdateStatus?: () => void;
  className?: string;
}

export default function PhaseCard({
  status,
  description,
  location,
  leadTime,
  userName,
  onUpdateStatus,
  className,
}: PhaseCardProps) {
  return (
    <Card
      className={(cn(' border-gray-300 shadow-sm p-4 rounded-xl '), className)}
    >
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between pt-1.5">
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
        <p className="text-sm font-medium text-gray-900">{description}</p>
        <p className="text-sm text-gray-500">
          {location ?? ''} • {leadTime}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">{userName ?? ''}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
