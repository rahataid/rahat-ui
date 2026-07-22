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
  Pause,
  Loader2,
} from 'lucide-react';
import { IvrFlow, IvrFlowNode, findNodeById } from './ivr.flow.types';
import { useUploadFile } from '@rahat-ui/query';
import { cn } from '@rahat-ui/shadcn/src';

function getBreadcrumbPath(root: IvrFlowNode, targetId: string): string[] {
  const path: string[] = [];
  const traverse = (node: IvrFlowNode): boolean => {
    path.push(node.label);
    if (node.id === targetId) return true;
    for (const child of node.children) {
      if (traverse(child)) return true;
    }
    path.pop();
    return false;
  };
  traverse(root);
  return path;
}

function AudioPreviewPlayer({
  src,
  fileName,
  onUpload,
  onCancel,
  uploadLabel = 'Upload',
}: {
  src: string;
  fileName: string;
  onUpload: () => void;
  onCancel: () => void;
  uploadLabel?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrent(val);
    }
  };

  return (
    <div className="p-4 border rounded-sm space-y-2">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 shrink-0"
          onClick={toggle}
        >
          {playing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <span className="text-xs text-muted-foreground w-10 tabular-nums shrink-0">
          {fmt(current)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={current}
          onChange={seek}
          className="flex-1 h-1 accent-primary cursor-pointer"
        />
        <span className="text-xs text-muted-foreground w-10 tabular-nums shrink-0">
          {fmt(duration)}
        </span>
      </div>
      <div className="text-xs text-muted-foreground truncate">{fileName}</div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          className="gap-2 rounded-sm flex-1"
          onClick={onUpload}
        >
          <Upload className="w-4 h-4" />
          {uploadLabel}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-sm flex-1"
          onClick={onCancel}
        >
          Discard
        </Button>
      </div>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
        preload="metadata"
        className="hidden"
      />
    </div>
  );
}

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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const breadcrumbPath = getBreadcrumbPath(flow.rootMenu, selectedNodeId);

  const [recordingPhase, setRecordingPhase] = useState<
    'idle' | 'recording' | 'done'
  >('idle');
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [streamRef, setStreamRef] = useState<MediaStream | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [uploadLabel, setUploadLabel] = useState('Upload');
  const [pendingUploadUrl, setPendingUploadUrl] = useState('');
  const [pendingUploadName, setPendingUploadName] = useState('');
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState('');
  const [promptMode, setPromptMode] = useState<
    'url' | 'record' | 'upload' | null
  >('url');
  const uploadFileMutation = useUploadFile();
  const isUploadPending = uploadFileMutation.isPending;

  const resetRecordingState = () => {
    setRecordingPhase('idle');
    setRecordingTimer(0);
    setRecordedBlob(null);
    setRecordedPreviewUrl('');
    setPendingUploadUrl('');
    setPendingUploadName('');
    if (streamRef) {
      streamRef?.getTracks().forEach((t) => t.stop());
      setStreamRef(null);
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  useEffect(() => {
    setIsEditing(false);
    setIsPreviewPlaying(false);
    resetRecordingState();
  }, [selectedNodeId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStreamRef(stream);
      chunksRef.current = [];
      setRecordingTimer(0);
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setRecordedPreviewUrl(URL.createObjectURL(blob));
        setRecordingPhase('done');
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingPhase('recording');
      timerIntervalRef.current = setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
    } catch {
      setRecordingPhase('idle');
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const uploadRecorded = async () => {
    if (!recordedBlob) return;
    try {
      const file = new File([recordedBlob], `recording_${Date.now()}.webm`, {
        type: 'audio/webm',
      });
      const formData = new FormData();
      formData.append('file', file);
      const { data: afterUpload } = await uploadFileMutation.mutateAsync(
        formData,
      );
      handleUpdate({ prompt: afterUpload.mediaURL });
      if (recordedPreviewUrl) URL.revokeObjectURL(recordedPreviewUrl);
      resetRecordingState();
      setUploadLabel('Uploaded');
      setTimeout(() => setUploadLabel('Upload'), 2000);
    } catch {
      resetRecordingState();
    }
  };

  const cancelRecording = () => {
    resetRecordingState();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingUploadUrl(url);
    setPendingUploadName(file.name);
    setPendingUploadFile(file);
    e.target.value = '';
  };

  const handleFileUpload = async () => {
    if (!pendingUploadUrl || !pendingUploadFile) return;
    try {
      const formData = new FormData();
      formData.append('file', pendingUploadFile);
      const { data: afterUpload } = await uploadFileMutation.mutateAsync(
        formData,
      );
      handleUpdate({ prompt: afterUpload.mediaURL });
      setPendingUploadUrl('');
      setPendingUploadName('');
      setPendingUploadFile(null);
    } catch {
      setPendingUploadFile(null);
    }
  };

  const cancelUpload = () => {
    if (pendingUploadUrl) URL.revokeObjectURL(pendingUploadUrl);
    setPendingUploadUrl('');
    setPendingUploadName('');
    setPendingUploadFile(null);
  };

  const togglePreview = (url: string) => {
    if (isPreviewPlaying && previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
      setIsPreviewPlaying(false);
      return;
    }
    if (!url) return;
    const audio = new Audio(url);
    previewAudioRef.current = audio;
    audio.onended = () => setIsPreviewPlaying(false);
    audio.onerror = () => setIsPreviewPlaying(false);
    audio
      .play()
      .then(() => setIsPreviewPlaying(true))
      .catch(() => setIsPreviewPlaying(false));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
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
            <h3 className="text-lg font-semibold">Node Properties</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2 rounded-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold">Audio Prompt</h4>
          {selectedItem.prompt ? (
            <div className="border rounded-sm p-4 space-y-3">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 rounded-sm"
                  onClick={() => togglePreview(selectedItem.prompt)}
                >
                  {isPreviewPlaying ? (
                    <Square className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  {isPreviewPlaying ? 'Stop' : 'Preview'}
                </Button>
                <span className="text-xs text-muted-foreground truncate flex-1">
                  {selectedItem.prompt.startsWith('blob:')
                    ? 'Recorded file'
                    : selectedItem.prompt.startsWith('data:')
                    ? 'Uploaded file'
                    : selectedItem.prompt}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-sm text-sm text-yellow-900">
              No prompt set — click Edit to add one
            </div>
          )}
        </div>

        {selectedItem.children.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Options</h4>
            <div className="space-y-2">
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
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold">Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-sm">
              <span className="text-sm">Hangup After Action</span>
              <span>{selectedItem.hangup ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-sm">
              <span className="text-sm">Digit Key</span>
              <span className="font-mono">{selectedItem.digit || '—'}</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-sm">
              <span className="text-sm">Webhook URL</span>
              <span className="text-sm text-muted-foreground truncate ml-2">
                {selectedItem.webhookUrl || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
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
        <h3 className="text-lg font-semibold">Edit Node</h3>
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm"
          onClick={() => setIsEditing(false)}
        >
          Done
        </Button>
      </div>

      <Separator />

      {isDigitItem ? (
        <div className="space-y-3">
          <Label>Menu Item</Label>
          <div className="flex gap-2 items-center">
            <div className="px-3 py-2 bg-muted rounded text-sm font-medium">
              Digit
            </div>
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
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Label</Label>
          <Input
            value={selectedItem.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            placeholder="Menu item label"
          />
        </div>
      )}

      <div className="space-y-3 relative">
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
            'space-y-3 relative',
            isUploadPending && 'blur-sm pointer-events-none',
          )}
        >
          <Label>Audio Prompt</Label>
          <Tabs
            value={promptMode || ''}
            onValueChange={(value) => {
              const v = value as 'url' | 'record' | 'upload';
              if (v === 'url') {
                resetRecordingState();
                setPromptMode('url');
              } else if (v === 'record') {
                setPendingUploadUrl('');
                setPendingUploadName('');
                setPromptMode('record');
              } else if (v === 'upload') {
                cancelRecording();
                setPromptMode('upload');
              }
            }}
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
              <div className="space-y-2">
                <Label htmlFor="prompt-url-input">Audio URL</Label>
                <Input
                  id="prompt-url-input"
                  value={selectedItem.prompt}
                  onChange={(e) => handleUpdate({ prompt: e.target.value })}
                  placeholder="https://example.com/audio.mp3"
                  className="text-xs"
                />
              </div>
            </TabsContent>
            <TabsContent value="record">
              <div className="space-y-2">
                {recordingPhase === 'idle' && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={startRecording}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                )}
                {recordingPhase === 'recording' && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-mono font-bold">
                      {formatTime(recordingTimer)}
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-2 ml-auto rounded-sm"
                      onClick={stopRecording}
                    >
                      <Square className="w-4 h-4" />
                      Stop
                    </Button>
                  </div>
                )}
                {recordingPhase === 'done' && recordedPreviewUrl && (
                  <AudioPreviewPlayer
                    src={recordedPreviewUrl}
                    fileName={`Recorded ${formatTime(recordingTimer)}`}
                    onUpload={uploadRecorded}
                    onCancel={cancelRecording}
                    uploadLabel={uploadLabel}
                  />
                )}
                {selectedItem.prompt.startsWith('blob:') &&
                  recordingPhase === 'idle' && (
                    <p className="text-xs text-green-600 text-center">
                      Currently using recorded audio
                    </p>
                  )}
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <div className="space-y-2">
                {!pendingUploadUrl ? (
                  <div
                    className="border-2 border-dashed border-muted-foreground/30 rounded-sm p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to browse or drag audio file here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      MP3, WAV, OGG, WEBM
                    </p>
                  </div>
                ) : (
                  <AudioPreviewPlayer
                    src={pendingUploadUrl}
                    fileName={pendingUploadName}
                    onUpload={handleFileUpload}
                    onCancel={cancelUpload}
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileSelected}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Options</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {selectedItem.children.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No options yet — use the + button in the tree to add options
            </p>
          ) : (
            selectedItem.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center gap-3 p-2 border rounded-sm text-sm"
              >
                <span className="font-mono font-bold w-8 text-center">
                  {child.digit || '?'}
                </span>
                <span className="flex-1 truncate">{child.label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Hangup After Action</Label>
        <div className="flex items-center justify-between p-3 border rounded-sm">
          <span className="text-sm">End call after this action</span>
          <Switch
            checked={selectedItem.hangup}
            onCheckedChange={(checked) => handleUpdate({ hangup: checked })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Webhook URL (Optional)</Label>
        <Input
          value={selectedItem.webhookUrl || ''}
          onChange={(e) => handleUpdate({ webhookUrl: e.target.value })}
          placeholder="https://example.com/webhook"
          className="text-xs"
        />
        <p className="text-xs text-muted-foreground">
          Webhook to call when this option is selected
        </p>
      </div>
    </div>
  );
}
