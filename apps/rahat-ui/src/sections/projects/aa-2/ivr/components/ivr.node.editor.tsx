'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
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
import {
  Link2,
  Mic,
  Upload,
  Play,
  Pencil,
  Square,
  Loader2,
} from 'lucide-react';
import { IvrFlow, IvrFlowNode } from '../types/ivr.flow.types';
import { findNodeById, getBreadcrumbPath } from '../utils/utils';
import { cn } from '@rahat-ui/shadcn/src';
import AudioUrlTab from './editor/ivr.audio.url.tab';
import AudioRecordTab from './editor/ivr.audio.record.tab';
import AudioUploadTab from './editor/ivr.audio.upload.tab';

interface NodeEditorPanelProps {
  flow: IvrFlow;
  selectedNodeId: string;
  onUpdateNode: (nodeId: string, updates: Partial<IvrFlowNode>) => void;
}

export default function NodeEditorPanel({
  flow,
  selectedNodeId,
  onUpdateNode,
}: NodeEditorPanelProps) {
  const selectedItem = findNodeById(flow.rootMenu, selectedNodeId);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [promptMode, setPromptMode] = useState<'url' | 'record' | 'upload'>(
    'url',
  );
  const [isUploadPending, setIsUploadPending] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const breadcrumbPath = getBreadcrumbPath(flow.rootMenu, selectedNodeId);

  useEffect(() => {
    setIsEditing(false);
    setIsPreviewPlaying(false);
  }, [selectedNodeId]);

  if (!selectedItem) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-6">
        <div className="text-center">
          <Pencil className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
          Select a menu item to edit
        </div>
      </div>
    );
  }

  const isDigitItem = selectedItem.label.startsWith('Digit ');
  const digitNumber = isDigitItem
    ? selectedItem.label.replace('Digit ', '')
    : null;

  const handleUpdate = (updates: Partial<IvrFlowNode>) => {
    onUpdateNode(selectedNodeId, updates);
  };

  if (!isEditing) {
    return (
      <div className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-y-auto h-full">
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

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base md:text-lg font-semibold">
              Node Properties
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2 rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <Separator />

        <div className="border rounded-sm p-4 space-y-3">
          <h4 className="font-semibold">Audio Prompt</h4>
          {selectedItem.prompt ? (
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="outline"
                className="gap-2 rounded-sm shrink-0"
                onClick={() => {
                  if (isPreviewPlaying && previewAudioRef.current) {
                    previewAudioRef.current.pause();
                    previewAudioRef.current = null;
                    setIsPreviewPlaying(false);
                    return;
                  }
                  if (!selectedItem.prompt) return;
                  const audio = new Audio(selectedItem.prompt);
                  previewAudioRef.current = audio;
                  audio.onended = () => setIsPreviewPlaying(false);
                  audio.onerror = () => setIsPreviewPlaying(false);
                  audio
                    .play()
                    .then(() => setIsPreviewPlaying(true))
                    .catch(() => setIsPreviewPlaying(false));
                }}
              >
                {isPreviewPlaying ? (
                  <Square className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                {isPreviewPlaying ? 'Stop' : 'Preview'}
              </Button>
              <span className="text-xs text-muted-foreground truncate">
                {selectedItem.prompt.startsWith('blob:')
                  ? 'Recorded file'
                  : selectedItem.prompt.startsWith('data:')
                  ? 'Uploaded file'
                  : selectedItem.prompt}
              </span>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-sm text-sm text-yellow-900">
              No prompt set — click Edit to add one
            </div>
          )}
        </div>

        <div className="border rounded-sm p-4 space-y-4">
          <h4 className="font-semibold">Options</h4>
          <Separator />
          {isDigitItem && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Digit Key</span>
              <span className="font-mono">{selectedItem.digit || '—'}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm">Hangup After Action</span>
            <span>{selectedItem.hangup ? 'Yes' : 'No'}</span>
          </div>

          {isDigitItem && selectedItem.children.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              {selectedItem.children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-3 border rounded-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-lg">
                      {child.digit || '?'}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{child.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {child.prompt ? 'Has audio' : 'No audio'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-y-auto h-full">
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

      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-semibold">Edit Node</h3>
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
          onClick={() => setIsEditing(false)}
        >
          Done
        </Button>
      </div>

      <Separator />

      <div className="border rounded-sm p-4 space-y-4 relative">
        {isUploadPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-sm">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Uploading audio...
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
          <h4 className="font-semibold">Audio Prompt</h4>
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
                <Link2 className="w-4 h-4" /> URL
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white gap-2"
                value="record"
              >
                <Mic className="w-4 h-4" /> Record
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white gap-2"
                value="upload"
              >
                <Upload className="w-4 h-4" /> Upload
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
        <h4 className="font-semibold">Options</h4>
        <Separator />
        {isDigitItem ? (
          <div className="flex items-center justify-between">
            <span className="text-sm">Digit</span>
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
            <span className="text-sm">Label</span>
            <Input
              value={selectedItem.label}
              onChange={(e) => handleUpdate({ label: e.target.value })}
              placeholder="Menu item label"
              className="w-48"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm">End call after this action</span>
          <Switch
            checked={selectedItem.hangup}
            onCheckedChange={(checked) => handleUpdate({ hangup: checked })}
          />
        </div>
      </div>
    </div>
  );
}
