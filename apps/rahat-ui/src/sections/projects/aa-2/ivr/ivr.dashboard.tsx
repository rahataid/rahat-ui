'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useIvrFlowStore } from './ivr.flow.store';
import { IvrListItem } from './ivr.flow.types';
import CreateIVRDialog from './ivr.create.dialog';
import {
  Phone,
  Copy,
  Trash2,
  MoreHorizontal,
  ArrowRight,
  Voicemail,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

function IvrCard({
  item,
  onDelete,
  onDuplicate,
}: {
  item: IvrListItem;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const router = useRouter();
  const { id } = useParams();
  const managePath = `/projects/aa/${id}/ivr/manage/${item.id}`;

  const handleDuplicate = () => {
    useIvrFlowStore.getState().duplicateFlow(item.id, `${item.name} (Copy)`);
    onDuplicate();
  };

  const handleDelete = () => {
    useIvrFlowStore.getState().deleteFlow(item.id);
    onDelete();
  };

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
            <CardDescription className="mt-1">
              {item.itemCount} menu item{item.itemCount !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(managePath)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={statusColors[item.status] || ''}>
              {item.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(item.lastModified).toLocaleDateString()}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(managePath)}
            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function IvrDashboard() {
  const flows = useIvrFlowStore((s) => s.flows);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'draft' | 'active' | 'archived'
  >('all');

  const ivrList: IvrListItem[] = flows.map((f) => {
    const count = (function countNodes(node: any): number {
      let c = 1;
      for (const child of node.children) c += countNodes(child);
      return c;
    })(f.rootMenu);
    return {
      id: f.id,
      name: f.name,
      description: f.description,
      status: f.status,
      itemCount: count,
      lastModified: f.updatedAt,
    };
  });

  const filteredList = ivrList.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">IVR Manager</h1>
            <p className="text-sm text-muted-foreground">
              Build and manage IVR flows
            </p>
          </div>
        </div>
        <CreateIVRDialog onIVRCreated={() => {}} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search IVRs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-sm"
        />
        <div className="flex gap-2">
          {(['all', 'draft', 'active', 'archived'] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
              className="capitalize rounded-sm"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-120px)]">
        {filteredList.length === 0 ? (
          <Card className="border-2 border-dashed rounded-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Voicemail className="w-12 h-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No IVRs found</CardTitle>
              <CardDescription>
                {ivrList.length === 0
                  ? 'Create your first IVR to get started'
                  : 'No IVRs match your search or filter'}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredList.map((item) => (
              <IvrCard
                key={item.id}
                item={item}
                onDelete={() => {}}
                onDuplicate={() => {}}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
