'use client';
import { useTransactionList } from 'apps/rahat-ui/src/hooks/cva/subgraph/queryCall';
import TransactionTable from './transactions.table';

export default function TransactionView() {
  return <TransactionTable />;
}
