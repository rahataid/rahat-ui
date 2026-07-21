'use client';

import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { cn } from '@rahat-ui/shadcn/src/utils';

type TabItem = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

type ReusableTabsProps = {
  defaultValue?: string;
  items: TabItem[];
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  onValueChange?: (value: string) => void;
};

export function ReusableTabs({
  defaultValue,
  items,
  listClassName,
  triggerClassName,
  contentClassName,
  orientation = 'horizontal',
  onValueChange,
}: ReusableTabsProps) {
  const activeValue = defaultValue || items[0]?.value;

  return (
    <Tabs
      defaultValue={activeValue}
      onValueChange={onValueChange}
      className="w-full"
    >
      <TabsList
        className={cn(
          'border bg-secondary rounded p-1 inline-flex h-auto gap-1',
          orientation === 'vertical' && 'flex-col',
          listClassName,
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              'data-[state=active]:bg-primary data-[state=active]:text-white text-xs px-3 py-1.5 flex items-center gap-1.5',
              triggerClassName,
            )}
          >
            {item.icon}
            {item.label}
            {item.badge}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className={cn('mt-4', contentClassName)}
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
