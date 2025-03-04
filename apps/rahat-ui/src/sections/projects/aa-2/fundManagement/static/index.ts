import { ITransactions } from 'packages/modules/types';
import { IFundManagement } from '../types';

export const FMTokensOverviewData = [
  {
    name: 'Project Balance',
    amount: '23,000',
  },
  {
    name: 'Tokens Distributed',
    amount: '10,000',
  },
  {
    name: 'Tokens Disbursed',
    amount: '5,000',
  },
  {
    name: '1 Token Value',
    amount: 'Rs. 10',
  },
];

export const FMTransactionsData: ITransactions[] = [
  {
    title: 'Salary Received',
    subTitle: 'Company XYZ',
    date: '2025-02-25',
    amount: '3,000',
    amtColor: 'green',
  },
  {
    title: 'Grocery Shopping',
    subTitle: 'SuperMart',
    date: '2025-02-24',
    amount: '120',
    amtColor: 'red',
  },
  {
    title: 'Freelance Payment',
    subTitle: 'Client ABC',
    date: '2025-02-23',
    amount: '500',
    amtColor: 'green',
  },
  {
    title: 'Gym Subscription',
    subTitle: 'FitClub',
    date: '2025-02-20',
    amount: '50',
    amtColor: 'red',
  },
  {
    title: 'Electricity Bill',
    subTitle: 'Utility Provider',
    date: '2025-02-18',
    amount: '75',
    amtColor: 'red',
  },
  {
    title: 'Dinner Out',
    subTitle: 'Italian Bistro',
    date: '2025-02-17',
    amount: '45',
    amtColor: 'red',
  },
  {
    title: 'Stock Dividend',
    subTitle: 'Investment Fund',
    date: '2025-02-15',
    amount: '200',
    amtColor: 'green',
  },
];

export const fundManagements: IFundManagement[] = [
  {
    id: '1',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Emergency Relief Fund',
    beneficiaryGroup: 'Low-Income Families',
    tokens: 5000,
    createdBy: 'admin1',
  },
  {
    id: '2',
    uuid: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Education Support Fund',
    beneficiaryGroup: 'Students',
    tokens: 3000,
    createdBy: 'admin2',
  },
  {
    id: '3',
    uuid: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Healthcare Assistance',
    beneficiaryGroup: 'Senior Citizens',
    tokens: 7000,
    createdBy: 'admin3',
  },
  {
    id: '4',
    uuid: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Women Empowerment Fund',
    beneficiaryGroup: 'Women Entrepreneurs',
    tokens: 6000,
    createdBy: 'admin4',
  },
  {
    id: '5',
    uuid: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Disaster Relief Fund',
    beneficiaryGroup: 'Natural Disaster Victims',
    tokens: 8000,
    createdBy: 'admin5',
  },
];
