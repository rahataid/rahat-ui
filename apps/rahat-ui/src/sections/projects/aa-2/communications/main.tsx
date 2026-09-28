'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useParams, useRouter } from 'next/navigation';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudDownloadIcon, PlusCircle, Bookmark } from 'lucide-react';
import { CommunicationsStatsCards } from './components/communications.stats.cards';
import { CommunicationsChannelRibbon } from './components/communications.channel.ribbon';
import { CommunicationsTable } from './components/communications.table';

export default function CommunicationsView() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();
  const { id: projectId } = useParams();

  return (
    <div className="flex flex-col p-4 space-y-5">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Heading
          title={t("COMMUNICATIONS_OUTREACH")}
          description={t("NEW_COMMUNICATION_DESCRIPTION")}
        />
        <div className="flex items-center gap-2 flex-wrap">
          <IconLabelBtn
            Icon={CloudDownloadIcon}
            name={t("EXPORT_LOGS")}
            variant="outline"
            className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
          />

          <Button 
            className="h-[clamp(28px,3vw,36px)] px-3.5 text-xs font-medium"
            onClick={() => router.push(`/projects/aa/${projectId}/communications/add`)}
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            {t("NEW_COMMUNICATION")}
          </Button>
        </div>
      </div>

      {/* ── Key Metrics Cards ── */}
      <CommunicationsStatsCards />

      {/* ── Channel Summary Ribbon ── */}
      <CommunicationsChannelRibbon />

      {/* ── Communications Data Section with Tabs ── */}
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="grid grid-cols-4 gap-1 w-full sm:w-[460px]">
            <TabsTrigger
              value="all"
              className={activeTab === 'all' ? 'bg-background shadow-sm' : ''}
            >
              {t("ALL")} ({formatDigits(1248)})
            </TabsTrigger>

            <TabsTrigger
              value="sms"
              className={activeTab === 'sms' ? 'bg-background shadow-sm' : ''}
            >
              {t("SMS")} ({formatDigits(892)})
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className={activeTab === 'voice' ? 'bg-background shadow-sm' : ''}
            >
              {t("VOICE")} ({formatDigits(240)})
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className={activeTab === 'email' ? 'bg-background shadow-sm' : ''}
            >
              {t("EMAIL")} ({formatDigits(116)})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value="all" className="m-0">
          <CommunicationsTable activeTab="all" />
        </TabsContent>

        <TabsContent value="sms" className="m-0">
          <CommunicationsTable activeTab="sms" />
        </TabsContent>
        <TabsContent value="voice" className="m-0">
          <CommunicationsTable activeTab="voice" />
        </TabsContent>
        <TabsContent value="email" className="m-0">
          <CommunicationsTable activeTab="email" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
