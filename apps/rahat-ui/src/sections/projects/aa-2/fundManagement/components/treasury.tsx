import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  CustomPagination,
  DemoTable,
  Heading,
  IconLabelBtn,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { Wallet, Coins } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetTokenDetails, usePagination } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useState } from 'react';
import { useTokenTransactionHistory } from '../columns/useTokenTransactionHistory';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import AddFundDialog from './add.fund.dialog';

const DUMMY_TRANSFER_HISTORY = [
  {
    uuid: '1',
    transactionHash: '0xabc1234567890abcdef1234567890abcdef12345678',
    from: '0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2',
    to: '0xB2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3',
    blockNumber: 12345678,
    value: '10,000',
    blockTimestamp: '2026-04-19T15:10:00Z',
  },
  {
    uuid: '2',
    transactionHash: '0xdef9876543210fedcba9876543210fedcba987654',
    from: '0xC3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4',
    to: '0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2',
    blockNumber: 12345678,
    value: '10,000',
    blockTimestamp: '2026-04-19T15:10:00Z',
  },
  {
    uuid: '3',
    transactionHash: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst',
    from: '0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2',
    to: '0xD4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5',
    blockNumber: 12345678,
    value: '10,000',
    blockTimestamp: '2026-04-19T15:10:00Z',
  },
  {
    uuid: '4',
    transactionHash: '0x9876dcba5432efgh1098ijkl7654mnop3210qrst',
    from: '0xE5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6',
    to: '0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2',
    blockNumber: 12345678,
    value: '10,000',
    blockTimestamp: '2026-04-19T15:10:00Z',
  },
  {
    uuid: '5',
    transactionHash: '0xfedc9876543210abcdef9876543210abcdef9876',
    from: '0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2',
    to: '0xF6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1',
    blockNumber: 12345678,
    value: '10,000',
    blockTimestamp: '2026-04-19T15:10:00Z',
  },
  {
    uuid: '6',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    from: '0xB2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3',
    to: '0xA1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4E5F6A1B2',
    blockNumber: 12345678,
    value: '10,000',
    blockTimestamp: '2026-04-19T15:10:00Z',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Treasury() {
  const params = useParams();
  const projectId = params.id as UUID;
  const [addFundOpen, setAddFundOpen] = useState(false);
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const { data: tokenDetails, isPending } = useGetTokenDetails(
    projectId as UUID,
  );
  console.log('Token Details:', tokenDetails);

  const columns = useTokenTransactionHistory();
  const table = useReactTable({
    data: DUMMY_TRANSFER_HISTORY,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {isPending ? (
        <SpinnerLoader />
      ) : (
        <div className="space-y-4">
          <AddFundDialog
            open={addFundOpen}
            onClose={() => setAddFundOpen(false)}
            projectUUID={projectId}
          />
          <div className="flex justify-between">
            <Heading
              title="Treasury"
              titleStyle="text-lg"
              description="Overview of token supply, project balance, and transfer history"
            />
            <IconLabelBtn
              Icon={Coins}
              name="Add Fund"
              handleClick={() => setAddFundOpen(true)}
            />
          </div>

          {/* ── Top Stats Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataCard
              className="rounded-sm"
              title="Total Token Supply"
              smallNumber={`${tokenDetails?.data.totalSupply} ${tokenDetails?.data.symbol}`}
              Icon={Coins}
              subtitle="Total tokens minted for this project"
            />
            <DataCard
              className="rounded-sm"
              title="Project Balance"
              smallNumber={`${tokenDetails?.data.projectBalance} ${tokenDetails?.data.symbol}`}
              Icon={Wallet}
              subtitle="Tokens currently held in project treasury"
            />
          </div>

          {/* ── Token Details Card ──────────────────────────────── */}
          <Card className="rounded-sm">
            <CardHeader className="pb-2 p-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Coins size={16} className="text-primary" />
                Token Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 p-3 bg-secondary rounded-sm">
                  <p className="text-xs text-muted-foreground">Token Name</p>
                  <p className="text-sm font-semibold">
                    {tokenDetails?.data.name}
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-secondary rounded-sm">
                  <p className="text-xs text-muted-foreground">Symbol</p>
                  <p className="text-sm font-semibold">
                    {tokenDetails?.data.symbol}
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-secondary rounded-sm">
                  <p className="text-xs text-muted-foreground">Decimals</p>
                  <p className="text-sm font-semibold">
                    {tokenDetails?.data.decimal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Transfer History ────────────────────────────────── */}
          <DemoTable
            table={table}
            tableHeight="h-[calc(100vh-420px)]"
            // loading={isLoading}
            message="No Fund Management List Available"
          />
          {/* <CustomPagination
            meta={metaData}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            total={groupsFundsData?.response?.meta?.lastPage || 0}
          /> */}
        </div>
      )}
    </>
  );
}
