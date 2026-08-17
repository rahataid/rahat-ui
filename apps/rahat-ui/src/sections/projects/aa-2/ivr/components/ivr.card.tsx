'use client';

import React from 'react';
import { memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { MoreHorizontal, ArrowRight, Archive } from 'lucide-react';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { IvrListItem } from '../types/ivr.flow.types';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

type IvrCardProps = {
  item: IvrListItem;
  onDelete: (item: IvrListItem) => void;
};

function IvrCard({ item, onDelete }: IvrCardProps) {
  const router = useRouter();
  const { id } = useParams();
  const managePath = `/projects/aa/${id}/ivr/manage/${item.id}`;

  return (
    <Card className="group hover:shadow transition-shadow rounded-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle
              className="group-hover:text-primary transition-colors cursor-pointer truncate"
              onClick={() => router.push(managePath)}
            >
              {item.name}
            </CardTitle>
          </div>
          <div className={item.status === 'archived' ? 'invisible' : ''}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDelete(item)}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Badge className={statusColors[item.status] || ''}>
            {item.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {dateFormat(new Date(item.lastModified))}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <IconLabelBtn
          variant="outline"
          className="border-primary text-primary flex-1 flex-row-reverse gap-2"
          Icon={ArrowRight}
          name="View Details"
          handleClick={() => router.push(managePath)}
        />
      </CardFooter>
    </Card>
  );
}

export default memo(IvrCard);
