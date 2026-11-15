import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import CommsLogsTable from './comms.logs.table';

jest.mock(
  'next-intl',
  () => ({ useTranslations: () => (key: string) => key }),
  { virtual: true },
);
jest.mock('apps/rahat-ui/src/common', () => ({
  NoResult: ({ message }: { message: string }) => <span>{message}</span>,
  SpinnerLoader: () => <span>Loading</span>,
}));

type Row = { recipient: string; status: string };
const column = createColumnHelper<Row>();
const columns = [
  column.accessor('recipient', { header: 'Recipient' }),
  column.accessor('status', { header: 'Status' }),
];

function Fixture({
  rows,
  loading = false,
}: {
  rows: Row[];
  loading?: boolean;
}) {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return <CommsLogsTable table={table} isLoading={loading} />;
}

describe('communication logs table', () => {
  it('renders rows in a horizontally scrollable, semantic table', () => {
    const { container } = render(
      <Fixture rows={[{ recipient: 'Example', status: 'Sent' }]} />,
    );
    const table = screen.getByRole('table');
    expect(table.querySelector('thead')).toBeTruthy();
    expect(table.querySelector('tbody')).toBeTruthy();
    expect(screen.getByText('Example')).toBeTruthy();
    expect(table.className).toContain('min-w-[700px]');
    expect(container.firstElementChild?.className).toContain('overflow-auto');
  });

  it('preserves loading and empty states', () => {
    const { rerender } = render(<Fixture rows={[]} loading />);
    expect(screen.getByText('Loading')).toBeTruthy();
    rerender(<Fixture rows={[]} />);
    expect(screen.getByText('NO_COMMUNICATIONS_LOGS_AVAILABLE')).toBeTruthy();
  });
});
