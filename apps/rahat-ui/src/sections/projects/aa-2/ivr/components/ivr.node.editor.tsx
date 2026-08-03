'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Link2, Mic, Upload, Pencil, Loader2 } from 'lucide-react';
import { IvrFlow, IvrFlowNode } from '../types/ivr.flow.types';
import { findNodeById, getBreadcrumbPath } from '../utils/utils';
import { cn } from '@rahat-ui/shadcn/src';
import { AudioPreviewPlayer } from './ivr.audio.preview';
import AudioUrlTab from './editor/ivr.audio.url.tab';
import AudioRecordTab from './editor/ivr.audio.record.tab';
import AudioUploadTab from './editor/ivr.audio.upload.tab';
import { useTranslations } from 'next-intl';

interface NodeEditorPanelProps {
  flow: IvrFlow;
  selectedNodeId: string;
  onUpdateNode: (nodeId: string, updates: Partial<IvrFlowNode>) => void;
  onEditingChange?: (editing: boolean) => void;
}

export default function NodeEditorPanel({
  flow,
  selectedNodeId,
  onUpdateNode,
  onEditingChange,
}: NodeEditorPanelProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const selectedItem = useMemo(
    () => findNodeById(flow.rootMenu, selectedNodeId),
    [flow.rootMenu, selectedNodeId],
  );
  const breadcrumbPath = useMemo(
    () => getBreadcrumbPath(flow.rootMenu, selectedNodeId),
    [flow.rootMenu, selectedNodeId],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [promptMode, setPromptMode] = useState<'url' | 'record' | 'upload'>(
    'url',
  );
  const [isUploadPending, setIsUploadPending] = useState(false);
  const snapshotRef = useRef<Partial<IvrFlowNode> | null>(null);

  const handleUpdate = useCallback(
    (updates: Partial<IvrFlowNode>) => {
      onUpdateNode(selectedNodeId, updates);
    },
    [onUpdateNode, selectedNodeId],
  );

  const handleEdit = useCallback(() => {
    if (!selectedItem) return;
    snapshotRef.current = {
      label: selectedItem.label,
      prompt: selectedItem.prompt,
      hangup: selectedItem.hangup,
      digit: selectedItem.digit,
    };
    setIsEditing(true);
    onEditingChange?.(true);
  }, [selectedItem, onEditingChange]);

  const handleCancel = useCallback(() => {
    if (snapshotRef.current) {
      onUpdateNode(selectedNodeId, snapshotRef.current);
    }
    snapshotRef.current = null;
    setIsEditing(false);
    onEditingChange?.(false);
  }, [onUpdateNode, selectedNodeId, onEditingChange]);

  const handleSave = useCallback(() => {
    snapshotRef.current = null;
    setIsEditing(false);
    onEditingChange?.(false);
  }, [onEditingChange]);

  if (!selectedItem) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-6">
        <div className="text-center">
          <Pencil className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
          {t('SELECT_MENU_ITEM_TO_EDIT_SHORT')}
        </div>
      </div>
    );
  }

  const isDigitItem = selectedItem.label.startsWith('Digit ');
  const digitNumber = isDigitItem
    ? selectedItem.label.replace('Digit ', '')
    : null;

  const breadcrumb = (
    <div className="flex items-center gap-2 text-[clamp(11px,1vw,14px)] text-muted-foreground mb-4 flex-wrap">
      {breadcrumbPath.map((label, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span
            className={
              idx === breadcrumbPath.length - 1
                ? 'text-foreground font-medium'
                : ''
            }
          >
            {label}
          </span>
          {idx < breadcrumbPath.length - 1 && (
            <span className="text-xs text-muted-foreground">/</span>
          )}
        </div>
      ))}
    </div>
  );

  if (!isEditing) {
    return (
      <div className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-y-auto h-full">
        {breadcrumb}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base md:text-lg font-semibold">
              {t('NODE_PROPERTIES')}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="gap-2 rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
          >
            <Pencil className="w-4 h-4" />
            {tg('EDIT')}
          </Button>
        </div>

        <Separator />

        <div className="border rounded-sm p-4 space-y-3">
          <h4 className="font-semibold">{t('AUDIO_PROMPT')}</h4>
          {selectedItem.prompt ? (
            <AudioPreviewPlayer
              src={selectedItem.prompt}
              fileName={
                selectedItem.prompt.startsWith('blob:')
                  ? t('RECORDED_FILE')
                  : selectedItem.prompt.startsWith('data:')
                  ? t('UPLOADED_FILE')
                  : selectedItem.prompt
              }
              hideActions
              noCard
            />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-sm text-sm text-yellow-900">
              {t('NO_PROMPT_SET_CLICK_EDIT')}
            </div>
          )}
        </div>

        <div className="border rounded-sm p-4 space-y-4">
          <h4 className="font-semibold">{t('OPTIONS')}</h4>
          <Separator />
          {isDigitItem && (
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('DIGIT_KEY')}</span>
              <span className="font-mono">{selectedItem.digit || '—'}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('HANGUP_AFTER_ACTION')}</span>
            <span>{selectedItem.hangup ? tg('YES') : tg('NO')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-y-auto h-full">
      {breadcrumb}

      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold">{t('EDIT_NODE')}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
            onClick={handleCancel}
          >
            {tg('CANCEL')}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
            onClick={handleSave}
          >
            {tg('SAVE')}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="border rounded-sm p-4 space-y-4 relative">
        {isUploadPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-sm">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('UPLOADING_AUDIO')}
              </span>
            </div>
          </div>
        )}
        <div
          className={cn(
            'space-y-4 relative',
            isUploadPending && 'blur-sm pointer-events-none',
          )}
        >
          <h4 className="font-semibold">{t('AUDIO_PROMPT')}</h4>
          <Tabs
            value={promptMode}
            onValueChange={(value) =>
              setPromptMode(value as 'url' | 'record' | 'upload')
            }
          >
            <TabsList className="border bg-secondary rounded w-full">
              <TabsTrigger
                className="w-full data-[state=active]:bg-white gap-2"
                value="url"
              >
                <Link2 className="w-4 h-4" /> {t('URL')}
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white gap-2"
                value="record"
              >
                <Mic className="w-4 h-4" /> {t('RECORD')}
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white gap-2"
                value="upload"
              >
                <Upload className="w-4 h-4" /> {t('UPLOAD')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <AudioUrlTab
                prompt={selectedItem.prompt}
                onUpdate={handleUpdate}
              />
            </TabsContent>
            <TabsContent value="record">
              <AudioRecordTab
                prompt={selectedItem.prompt}
                onUpdate={handleUpdate}
                onUploadingChange={setIsUploadPending}
              />
            </TabsContent>
            <TabsContent value="upload">
              <AudioUploadTab
                onUpdate={handleUpdate}
                onUploadingChange={setIsUploadPending}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="border rounded-sm p-6 space-y-4">
        <h4 className="font-semibold">{t('OPTIONS')}</h4>
        <Separator />
        {isDigitItem ? (
          <div className="flex items-center justify-between">
            <span className="text-sm">{t('DIGIT')}</span>
            <Select
              value={digitNumber || '1'}
              onValueChange={(value) => {
                handleUpdate({ label: `Digit ${value}`, digit: value });
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 9 }, (_, i) => String(i + 1)).map(
                  (num) => (
                    <SelectItem key={num} value={num}>
                      {num}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm">{tg('LABEL')}</span>
            <Input
              value={selectedItem.label}
              onChange={(e) => handleUpdate({ label: e.target.value })}
              placeholder={t('MENU_ITEM_LABEL')}
              className="w-48"
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm">{t('END_CALL_AFTER_THIS_ACTION')}</span>
          <Switch
            checked={selectedItem.hangup}
            onCheckedChange={(checked) => handleUpdate({ hangup: checked })}
          />
        </div>
      </div>
    </div>
  );
}
