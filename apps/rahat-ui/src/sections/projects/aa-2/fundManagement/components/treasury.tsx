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
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function Treasury() {
  const t = useTranslations('AA_PROJECT');
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

  const formatNum = useNumberFormat();

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
              title={t('TREASURY')}
              titleStyle="text-lg"
              description={t('OVERVIEW_OF_TOKEN_SUPPLY')}
            />
            <IconLabelBtn
              Icon={Coins}
              name={t('ADD_FUND')}
              handleClick={() => setAddFundOpen(true)}
            />
          </div>

          {/* ── Top Stats Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataCard
              className="rounded-sm"
              title={t('TOTAL_TOKEN_SUPPLY')}
              smallNumber={`${formatNum(tokenDetails?.data.totalSupply)} ${tokenDetails?.data.symbol}`}
              Icon={Coins}
              subtitle={t('TOTAL_TOKENS_MINTED_FOR_THIS_PROJECT')}
            />
            <DataCard
              className="rounded-sm"
              title={t('PROJECT_BALANCE')}
              smallNumber={`${formatNum(tokenDetails?.data.projectBalance)} ${tokenDetails?.data.symbol}`}
              Icon={Wallet}
              subtitle={t('TOKENS_CURRENTLY_HELD_IN_PROJECT_TREASURY')}
            />
          </div>

          {/* ── Token Details Card ──────────────────────────────── */}
          <Card className="rounded-sm">
            <CardHeader className="pb-2 p-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Coins size={16} className="text-primary" />
                {t('TOKEN_DETAILS')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 p-3 bg-secondary rounded-sm">
                  <p className="text-xs text-muted-foreground">{t('TOKEN_NAME')}</p>
                  <p className="text-sm font-semibold">
                    {tokenDetails?.data.name}
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-secondary rounded-sm">
                  <p className="text-xs text-muted-foreground">{t('SYMBOL')}</p>
                  <p className="text-sm font-semibold">
                    {tokenDetails?.data.symbol}
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-secondary rounded-sm">
                  <p className="text-xs text-muted-foreground">{t('DECIMALS')}</p>
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
            message={t('NO_TOKEN_TRANSFERS')}
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
