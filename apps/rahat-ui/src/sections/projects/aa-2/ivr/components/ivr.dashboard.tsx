'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useIvrTemplates, useIvrTemplateDelete } from '@rahat-ui/query';
import {
  Voicemail,
} from 'lucide-react';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import CreateIVRDialog from './ivr.create.dialog';
import IvrCard from './ivr.card';
import { useTranslations } from 'next-intl';

export default function IvrDashboard() {
  const { id: projectUUID } = useParams();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
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

  const ivrList = useMemo(
    () =>
      (templates || []).map((t) => ({
        id: String(t.id),
        name: t.name,
        description: t.description,
        status: t.status.toLowerCase() as 'draft' | 'active' | 'archived',
        itemCount: 0,
        lastModified: new Date(t.updatedAt).getTime(),
      })),
    [templates],
  );

  const filteredList = useMemo(
    () =>
      ivrList.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [ivrList, searchQuery, statusFilter],
  );

  const handleDelete = useCallback(
    (item: { id: string; name: string }) =>
      setDeleteTarget({ id: Number(item.id), name: item.name }),
    [],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteIvr.mutateAsync({
      projectUUID: projectUUID as UUID,
      id: deleteTarget.id,
    });
    setDeleteTarget(null);
  }, [deleteTarget, deleteIvr, projectUUID]);

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[clamp(20px,2.5vw,28px)] font-bold text-foreground">
              {t('IVR_MANAGER')}
            </h1>
            <p className="text-[clamp(12px,1vw,14px)] text-muted-foreground">
              {t('BUILD_AND_MANAGE_IVR_FLOWS')}
            </p>
          </div>
        </div>
        <CreateIVRDialog projectUUID={projectUUID as UUID} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder={t('SEARCH_IVRS')}
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
              {tg.has(status.toUpperCase() as never)
                ? tg(status.toUpperCase() as never)
                : status}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-140px)]">
        {isLoading ? (
          <Card className="rounded-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">{t('LOADING_IVR_TEMPLATES')}</p>
            </CardContent>
          </Card>
        ) : filteredList.length === 0 ? (
          <Card className="border-2 border-dashed rounded-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Voicemail className="w-12 h-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">{t('NO_IVRS_FOUND')}</CardTitle>
              <CardDescription>
                {ivrList.length === 0
                  ? t('CREATE_YOUR_FIRST_IVR')
                  : t('NO_IVRS_MATCH_SEARCH')}
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredList.map((item) => (
              <IvrCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <ConfirmationDialog
        isConfirmationDialogOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        dialogTitle={t('ARCHIVE_IVR')}
        dialogMessage={t('ARCHIVE_IVR_CONFIRMATION', { name: deleteTarget?.name ?? '' })}
      />
    </div>
  );
}
