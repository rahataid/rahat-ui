/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DemoTable } from './table';
import { CustomPagination } from './custom.pagination';

jest.mock(
  '@rahat-ui/shadcn/src/components/ui/table',
  () => ({
    Table: ({
      children,
      className,
    }: React.HTMLAttributes<HTMLTableElement>) => (
      <table className={className}>{children}</table>
    ),
    TableHeader: ({
      children,
      className,
    }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className={className}>{children}</thead>
    ),
    TableBody: ({
      children,
    }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody>{children}</tbody>
    ),
    TableFooter: ({
      children,
    }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tfoot>{children}</tfoot>
    ),
    TableRow: ({ children }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr>{children}</tr>
    ),
    TableHead: ({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th>{children}</th>
    ),
    TableCell: ({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td>{children}</td>
    ),
  }),
  { virtual: true },
);
jest.mock(
  '@rahat-ui/shadcn/src/components/ui/skeleton',
  () => ({ Skeleton: () => null }),
  { virtual: true },
);
jest.mock('./noResults', () => ({ NoResult: () => <div>No results</div> }));
jest.mock(
  'next-intl',
  () => ({
    useTranslations: () => (key: string) => key,
  }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/utils/i18n/number',
  () => ({ useNumberFormat: () => String }),
  { virtual: true },
);
jest.mock(
  'libs/shadcn/src',
  () => ({ cn: (...values: string[]) => values.filter(Boolean).join(' ') }),
  { virtual: true },
);
jest.mock(
  'libs/shadcn/src/components/ui/button',
  () => ({
    Button: ({
      children,
      onClick,
      disabled,
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
  }),
  { virtual: true },
);
jest.mock(
  'libs/shadcn/src/components/ui/select',
  () => ({
    Select: () => <div>Page size</div>,
    SelectContent: () => null,
    SelectGroup: () => null,
    SelectItem: () => null,
    SelectTrigger: () => null,
    SelectValue: () => null,
  }),
  { virtual: true },
);

function TableFixture({ tableClassName }: { tableClassName?: string }) {
  const table = useReactTable({
    data: [{ title: 'Water supply' }],
    columns: [{ accessorKey: 'title', header: 'Title' }],
    getCoreRowModel: getCoreRowModel(),
  });
  return <DemoTable table={table} tableClassName={tableClassName} />;
}

it('preserves rows and allows a caller to set a scrollable table width', () => {
  const { rerender } = render(<TableFixture />);
  expect(screen.getByText('Water supply')).toBeTruthy();
  expect(screen.getByRole('table').className).not.toContain('min-w-[900px]');
  rerender(<TableFixture tableClassName="min-w-[900px]" />);
  expect(screen.getByRole('table').className).toContain('min-w-[900px]');
  expect(screen.getByRole('table').parentElement?.className).toContain(
    'overflow-auto',
  );
});

it('accepts responsive pagination classes while keeping paging controls functional', () => {
  const next = jest.fn();
  const { container } = render(
    <CustomPagination
      className="flex-wrap"
      currentPage={1}
      perPage={10}
      meta={{
        total: 25,
        currentPage: 1,
        lastPage: 3,
        perPage: 10,
        prev: null,
        next: 2,
      }}
      handleNextPage={next}
      handlePrevPage={jest.fn()}
    />,
  );
  expect(container.firstElementChild?.className).toContain('flex-wrap');
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[2]);
  expect(next).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/TOTAL_COUNT/)).toBeTruthy();
});
