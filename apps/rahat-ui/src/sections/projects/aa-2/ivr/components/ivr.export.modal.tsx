'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
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
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useUploadFile, useIvrTemplateUpdate, useIvrTestCall } from '@rahat-ui/query';
import { Link, Copy, Check, Globe, Phone, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';

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
  const { id: projectUUID } = useParams();
  const t = useTranslations('AA_PROJECT');
  const [ipfsLink, setIpfsLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const uploadFile = useUploadFile();
  const updateTemplate = useIvrTemplateUpdate();
  const sendTestCall = useIvrTestCall();

  const handleClose = () => {
    setIpfsLink('');
    setCopiedLink(false);
    onClose();
  };

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
        projectUUID: projectUUID as UUID,
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

  const handleSendTestCall = async () => {
    if (!testPhone) return;
    setIsSending(true);
    try {
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const file = new File([blob], 'ivr-flow.json', {
        type: 'application/json',
      });
      const formData = new FormData();
      formData.append('file', file);
      const { data: uploaded } = await uploadFile.mutateAsync(formData);
      await sendTestCall.mutateAsync({
        projectUUID: projectUUID as UUID,
        payload: {
          phoneNumber: testPhone,
          flowUrl: uploaded.mediaURL,
        },
      });
      setTestPhone('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="!rounded-sm max-w-[clamp(320px,90vw,550px)]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('EXPORT_IVR_FLOW')}</DialogTitle>
          <DialogDescription>
            {t('EXPORT_IVR_FLOW_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="mt-2">
          <TabsList className="border bg-secondary rounded w-full">
            <TabsTrigger
              className="w-full data-[state=active]:bg-white gap-2"
              value="link"
            >
              <Link className="w-4 h-4" /> {t('COPY_LINK')}
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white gap-2"
              value="webhook"
            >
              <Globe className="w-4 h-4" /> {t('WEBHOOK')}
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white gap-2"
              value="test"
            >
              <Phone className="w-4 h-4" /> {t('TEST_CALL')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {t('GENERATE_PERMANENT_IPFS_LINK')}
            </p>
            <Button
              variant="default"
              className="w-full gap-2 rounded-sm"
              onClick={handleGenerateLink}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Link className="w-4 h-4" />
              )}
              {isGenerating ? t('GENERATING') : t('GENERATE_LINK')}
            </Button>

            {ipfsLink && (
              <div className="border rounded-sm p-3 space-y-2">
                <Label>{t('IPFS_LINK')}</Label>
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
                    title={t('COPY_LINK')}
                    className="rounded-sm"
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
                    title={t('OPEN_LINK')}
                    className="rounded-sm"
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
              </div>
            )}

            <div className="space-y-2">
              <Label>{t('JSON_CONTENT')}</Label>
              <div className="rounded-sm border overflow-hidden">
                <textarea
                  className="w-full h-40 p-3 text-xs font-mono bg-card resize-none focus:outline-none"
                  value={jsonContent}
                  readOnly
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {t('SEND_IVR_FLOW_TO_ENDPOINT')}
            </p>
            <div className="space-y-2">
              <Label>{t('WEBHOOK_URL')}</Label>
              <Input placeholder="https://example.com/webhook" />
            </div>
            <Button variant="default" className="w-full gap-2 rounded-sm">
              <Globe className="w-4 h-4" />
              {t('SEND_TO_WEBHOOK')}
            </Button>
          </TabsContent>

          <TabsContent value="test" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {t('SEND_TEST_CALL_DESCRIPTION')}
            </p>
            <div className="space-y-2">
              <Label>{t('PHONE_NUMBER')}</Label>
              <Input
                placeholder={t('ENTER_PHONE_NUMBER')}
                value={testPhone}
                onChange={(e) => setTestPhone(toAsciiDigits(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                {t('STANDARD_CALL_RATES_MAY_APPLY')}
              </p>
            </div>
            <Button
              variant="default"
              className="w-full gap-2 rounded-sm"
              disabled={isSending || !testPhone}
              onClick={handleSendTestCall}
            >
              {isSending ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Phone className="w-4 h-4" />
              )}
              {isSending ? t('SENDING') : t('SEND_TEST_CALL')}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
