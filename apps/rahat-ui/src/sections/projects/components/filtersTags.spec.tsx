/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FiltersTags from './filtersTags';

jest.mock(
  '@rahat-ui/shadcn/src/components/ui/button',
  () => ({
    Button: ({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick}>{children}</button>
    ),
  }),
  { virtual: true },
);
jest.mock(
  '@rahat-ui/shadcn/src/components/ui/scroll-area',
  () => ({
    ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ScrollBar: () => null,
  }),
  { virtual: true },
);

describe('project filter tags', () => {
  it('renders the Lucide remove icon and removes only the clicked filter', () => {
    const setFilters = jest.fn();
    const { container } = render(
      <FiltersTags
        filters={{ name: 'Alice', status: 'ACTIVE' }}
        setFilters={setFilters}
        total={2}
      />,
    );
    expect(container.querySelectorAll('svg.lucide-circle-x')).toHaveLength(2);
    fireEvent.click(screen.getByText('Alice'));
    expect(setFilters).toHaveBeenCalledWith({ status: 'ACTIVE' });
  });

  it('keeps clear-all behavior', () => {
    const setFilters = jest.fn();
    render(<FiltersTags filters={{ name: 'Alice' }} setFilters={setFilters} total={1} />);
    fireEvent.click(screen.getByText('Clear filter'));
    expect(setFilters).toHaveBeenCalledWith({});
  });
});
