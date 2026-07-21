'use client';

import { useState } from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useUploadFile, useIvrTemplateUpdate } from '@rahat-ui/query';
import { Link, Copy, Check, Globe, Phone, ExternalLink } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  ivrId: number;
  jsonContent: string;
  onExported?: () => void;
}

export default function ExportModal({
  open,
  onClose,
  ivrId,
  jsonContent,
  onExported,
}: ExportModalProps) {
  const [ipfsLink, setIpfsLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const uploadFile = useUploadFile();
  const updateTemplate = useIvrTemplateUpdate();

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const file = new File([blob], 'ivr-flow.json', {
        type: 'application/json',
      });
      const formData = new FormData();
      formData.append('file', file);
      const { data: afterUpload } = await uploadFile.mutateAsync(formData);
      setIpfsLink(afterUpload.mediaURL);
      await updateTemplate.mutateAsync({
        id: ivrId,
        payload: { flowUrl: afterUpload.mediaURL },
      });
      onExported?.();
    } catch {
      // error handled by mutation toast
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ipfsLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export IVR Flow</DialogTitle>
          <DialogDescription>
            Download your IVR flow as JSON, copy a link, or send to a webhook.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="mt-2">
          <TabsList className="border bg-secondary rounded w-full">
            <TabsTrigger
              className="w-full data-[state=active]:bg-white gap-2"
              value="link"
            >
              <Link className="w-4 h-4" /> Copy Link
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white gap-2"
              value="webhook"
            >
              <Globe className="w-4 h-4" /> Webhook
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white gap-2"
              value="test"
            >
              <Phone className="w-4 h-4" /> Test Call
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Generate a permanent IPFS link to your IVR flow JSON or copy the
              JSON directly
            </p>
            <div className="flex justify-center">
              <Button
                variant="default"
                className="gap-2 rounded-sm"
                onClick={handleGenerateLink}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Link className="w-4 h-4" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Link'}
              </Button>
            </div>

            {ipfsLink && (
              <div className="space-y-2">
                <label className="text-sm font-medium">IPFS Link</label>

                <div className="flex items-center gap-2">
                  <Input
                    value={ipfsLink}
                    readOnly
                    className="flex-1 text-xs font-mono"
                  />

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyLink}
                    title="Copy link"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    asChild
                    title="Open link"
                  >
                    <a
                      href={ipfsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  This is a permanent IPFS link to your IVR flow JSON.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">JSON Content</label>
              <textarea
                className="w-full h-40 p-3 text-xs font-mono border rounded-sm bg-muted/30 resize-none focus:outline-none"
                value={jsonContent}
                readOnly
              />
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Configure a webhook URL to send the IVR flow data to an external
              endpoint.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook URL</label>
              <Input placeholder="https://example.com/webhook" />
            </div>
            <Button variant="default" className="gap-2 rounded-sm">
              <Globe className="w-4 h-4" />
              Send to Webhook
            </Button>
          </TabsContent>

          <TabsContent value="test" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Send a test call to experience your IVR flow in real-time
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input placeholder="123456789" />
              <p className="text-xs text-muted-foreground">
                Enter the phone number where you want to receive the test call
              </p>
            </div>
            <Button variant="default" className="gap-2 rounded-sm">
              <Phone className="w-4 h-4" />
              Send Test Call
            </Button>
            <p className="text-xs text-muted-foreground">
              Note: Standard call rates may apply depending on your provider
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
