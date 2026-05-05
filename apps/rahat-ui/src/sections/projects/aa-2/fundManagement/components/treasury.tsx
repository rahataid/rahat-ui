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
import {
  useGetTokenDetails,
  useGetTransferList,
  usePagination,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useState } from 'react';
import { useTokenTransactionHistory } from '../columns/useTokenTransactionHistory';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import AddFundDialog from './add.fund.dialog';

export default function Treasury() {
  const params = useParams();
  const projectId = params.id as UUID;
  const [addFundOpen, setAddFundOpen] = useState(false);
  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();
  const { data: tokenDetails, isPending } = useGetTokenDetails(
    projectId as UUID,
  );

  const { data: transferHistory, isFetching: isTransferHistoryFetching } =
    useGetTransferList(projectId as UUID, pagination);

  const columns = useTokenTransactionHistory();
  const table = useReactTable({
    data: transferHistory?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {isPending ? (
        <div className="h-[calc(100vh-300px)]">
          <SpinnerLoader />
        </div>
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
            message="No token transfers have been made yet."
            loading={isTransferHistoryFetching}
          />
          <CustomPagination
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            setPagination={setPagination}
            total={transferHistory?.meta?.total}
            meta={
              transferHistory?.meta || {
                total: 0,
                currentPage: 1,
                lastPage: 1,
                perPage: 10,
                prev: null,
                next: null,
              }
            }
          />
        </div>
      )}
    </>
  );
}
