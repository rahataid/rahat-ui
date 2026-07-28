'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useIvrTemplates, useIvrTemplateDelete } from '@rahat-ui/query';
import { IvrListItem } from '../types/ivr.flow.types';
import {
  Trash2,
  MoreHorizontal,
  ArrowRight,
  Voicemail,
  Archive,
} from 'lucide-react';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import CreateIVRDialog from './ivr.create.dialog';

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

function IvrCard({
  item,
  onDelete,
}: {
  item: IvrListItem;
  onDelete: (item: IvrListItem) => void;
}) {
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
          {item.status !== 'archived' && (
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
                <DropdownMenuItem onClick={() => onDelete(item)}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Badge className={statusColors[item.status] || ''}>
            {item.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {new Date(item.lastModified).toLocaleDateString()}
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

export default function IvrDashboard() {
  const { id: projectUUID } = useParams();
  const { data: templates, isLoading } = useIvrTemplates(projectUUID as UUID);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'draft' | 'active' | 'archived'
  >('all');
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const deleteIvr = useIvrTemplateDelete();

  const ivrList: IvrListItem[] = (templates || []).map((t) => ({
    id: String(t.id),
    name: t.name,
    description: t.description,
    status: t.status.toLowerCase() as 'draft' | 'active' | 'archived',
    itemCount: 0,
    lastModified: new Date(t.updatedAt).getTime(),
  }));

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[clamp(20px,2.5vw,28px)] font-bold text-foreground">IVR Manager</h1>
            <p className="text-[clamp(12px,1vw,14px)] text-muted-foreground">
              Build and manage IVR flows
            </p>
          </div>
        </div>
        <CreateIVRDialog projectUUID={projectUUID as UUID} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search IVRs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-sm h-[clamp(32px,3vw,40px)]"
        />
        <div className="flex gap-2 flex-wrap">
          {(['all', 'draft', 'active', 'archived'] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
              className="capitalize rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-140px)]">
        {isLoading ? (
          <Card className="rounded-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">Loading IVR templates...</p>
            </CardContent>
          </Card>
        ) : filteredList.length === 0 ? (
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
                onDelete={(i) =>
                  setDeleteTarget({ id: Number(i.id), name: i.name })
                }
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <ConfirmationDialog
        isConfirmationDialogOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteIvr.mutateAsync({ projectUUID: projectUUID as UUID, id: deleteTarget.id });
          setDeleteTarget(null);
        }}
        dialogTitle="Archive IVR"
        dialogMessage={`Are you sure you want to archive "${deleteTarget?.name}"? This action will archive the IVR template and cannot be undone.`}
      />
    </div>
  );
}
