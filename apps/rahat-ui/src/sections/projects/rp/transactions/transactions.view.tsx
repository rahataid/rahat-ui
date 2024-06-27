'use client'
import TransactionTable from './transactions.table';
import { useRPProjectTransactions } from '@rahat-ui/query';

export default function TransactionView() {

 useRPProjectTransactions();
  return <TransactionTable />;
}
