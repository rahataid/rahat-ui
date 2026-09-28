'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DemoTable, CustomPagination, SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { ToggleColumns } from 'apps/rahat-ui/src/common/toggle.columns';
import useCommunicationsTableColumns, {
  CommunicationRecord,
} from './useCommunicationsTableColumns';

export const mockData: CommunicationRecord[] = [
  {
    id: '1',
    title: 'Pre-Monsoon Flood Early Warning SMS',
    description: 'कोशी र नारायणी तटीय क्षेत्रका बासिन्दाहरूलाई पूर्वतयारी सन्देश',
    channel: 'SMS',
    targetAudience: {
      beneficiaries: ['Ward 1-5 Residents', 'High-risk Vulnerable Families'],
      stakeholders: [],
    },
    recipients: 450,
    delivered: 442,
    failed: 8,
    sender: 'Admin (Rumsan)',
    status: 'DELIVERED',
    date: '2025-09-24',
  },
  {
    id: '2',
    title: 'Flood Alert Voice Call Broadcast',
    description: 'जलस्तर खतराको तहभन्दा माथि पुगेको आपत्कालीन फोन चेतावनी',
    channel: 'VOICE',
    targetAudience: {
      beneficiaries: ['All Beneficiaries'],
      stakeholders: ['Municipal Steering Committee'],
    },
    recipients: 218,
    delivered: 210,
    failed: 8,
    sender: 'Emergency Response Team',
    status: 'DELIVERED',
    date: '2025-09-23',
  },
  {
    id: '3',
    title: 'Ward 5 Relief Distribution Notice',
    description: 'राहत सामाग्री वितरण सम्बन्धी स्थानीय प्रतिनिधिहरूलाई इमेल',
    channel: 'EMAIL',
    targetAudience: {
      beneficiaries: [],
      stakeholders: ['Municipal Steering Committee', 'Field Staff'],
    },
    recipients: 56,
    delivered: 50,
    failed: 0,
    sender: 'Field Coordinator',
    status: 'IN_PROGRESS',
    date: '2025-09-23',
  },
  {
    id: '4',
    title: 'Cash Distribution Token Notification',
    description: 'डिजिटल टोकन र बैंकिङ प्रणाली सम्बन्धी लाभग्राही सन्देश',
    channel: 'SMS',
    targetAudience: {
      beneficiaries: ['Registered Cash Beneficiaries'],
      stakeholders: [],
    },
    recipients: 189,
    delivered: 189,
    failed: 0,
    sender: 'System Automation',
    status: 'DELIVERED',
    date: '2025-09-22',
  },
];

type TableProps = {
  activeTab?: string;
};

export function CommunicationsTable({ activeTab = 'all' }: TableProps) {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const columns = useCommunicationsTableColumns();

  const filteredData = React.useMemo(() => {
    let data = mockData;

    if (activeTab === 'sms') {
      data = data.filter((d) => d.channel === 'SMS');
    } else if (activeTab === 'voice') {
      data = data.filter((d) => d.channel === 'VOICE');
    } else if (activeTab === 'email') {
      data = data.filter((d) => d.channel === 'EMAIL');
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.targetAudience.beneficiaries?.join(' ').toLowerCase().includes(q) || false) ||
          (d.targetAudience.stakeholders?.join(' ').toLowerCase().includes(q) || false),
      );
    }

    if (channelFilter && channelFilter !== 'ALL') {
      data = data.filter((d) => d.channel === channelFilter);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      data = data.filter((d) => d.status === statusFilter);
    }

    return data;
  }, [activeTab, search, channelFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-card border rounded p-4 space-y-4">
      {/* ── Toolbar: Search, Filters & View Toggle ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <SearchInput
            name="COMMUNICATIONS"
            placeholder={t("SEARCH_COMMUNICATIONS")}
            className="w-full sm:w-64"
            value={search}
            onSearch={(e) => setSearch(e?.target?.value || '')}
          />
          <SelectComponent
            name={t("CHANNEL")}
            options={['ALL', 'SMS', 'VOICE', 'EMAIL']}
            labels={{
              ALL: t('ALL'),
              SMS: t('SMS'),
              VOICE: t('VOICE'),
              EMAIL: t('EMAIL'),
            }}
            onChange={(val) => setChannelFilter(val === 'ALL' ? '' : val)}
            value={channelFilter || 'ALL'}
            className="w-36"
          />
          <SelectComponent
            name={t("STATUS")}
            options={['ALL', 'DELIVERED', 'IN_PROGRESS', 'FAILED']}
            labels={{
              ALL: t('ALL'),
              DELIVERED: t('DELIVERED'),
              IN_PROGRESS: t('IN_PROGRESS'),
              FAILED: t('FAILED'),
            }}
            onChange={(val) => setStatusFilter(val === 'ALL' ? '' : val)}
            value={statusFilter || 'ALL'}
            className="w-40"
          />
          <DateRangePicker
            placeholder={t("DATE_RANGE")}
            type="range"
            handleDateChange={() => {}}
            handleClearDate={() => {}}
            className="h-[36px] text-xs"
          />
        </div>

        <ToggleColumns table={table} />
      </div>

      {/* ── Table Content ── */}
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-540px)]"
        message={t("NO_COMMUNICATIONS_FOUND")}
      />

      {/* ── Pagination ── */}
      <CustomPagination
        meta={{
          total: filteredData.length,
          currentPage: pagination.page,
          lastPage: 1,
          perPage: pagination.perPage,
          next: null,
          prev: null,
        }}
        handleNextPage={() => {}}
        handlePrevPage={() => {}}
        setPagination={setPagination}
        handlePageSizeChange={(size) =>
          setPagination((prev) => ({ ...prev, perPage: Number(size) }))
        }
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={filteredData.length}
      />
    </div>
  );
}
