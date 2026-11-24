/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ActivitiesList from './activities.list';

const mockPush = jest.fn();
const mockUseActivities = jest.fn(
  (_projectId: string, _filters: { phase?: string } | null) => ({
    activitiesData: [],
    activitiesMeta: { total: 0 },
    isLoading: false,
  }),
);
const mockUsePhases = jest.fn();

jest.mock(
  'next-intl',
  () => ({ useTranslations: () => (key: string) => key }),
  {
    virtual: true,
  },
);
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'project-1', title: 'readiness' }),
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock(
  '@rahat-ui/query',
  () => {
    const mockReact = jest.requireActual<typeof import('react')>('react');
    return {
      useActivities: (projectId: string, filters: { phase?: string } | null) =>
        mockUseActivities(projectId, filters),
      useActivitiesCategories: jest.fn(),
      useActivitiesStore: (selector: (state: object) => unknown) =>
        selector({ categories: [] }),
      usePhases: () => mockUsePhases(),
      usePagination: () => {
        const [filters, setFilters] = mockReact.useState({});
        const [pagination, setPagination] = mockReact.useState({
          page: 1,
          perPage: 10,
        });
        return {
          filters,
          setFilters,
          pagination,
          setPagination,
          setNextPage: jest.fn(),
          setPrevPage: jest.fn(),
          setPerPage: jest.fn(),
        };
      },
    };
  },
  { virtual: true },
);
jest.mock('@tanstack/react-table', () => ({
  getCoreRowModel: jest.fn(),
  useReactTable: () => ({ getRowModel: () => ({ rows: [] }) }),
}));
jest.mock('./useActivitiesTableColumn', () => () => []);
jest.mock('./activities.table.filters', () => () => null);
jest.mock(
  'apps/rahat-ui/src/utils/i18n/date',
  () => ({
    useDateFormat: () => jest.fn(),
  }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/utils/i18n/translateValue',
  () => ({
    translateValue: jest.fn(),
  }),
  { virtual: true },
);
jest.mock('apps/rahat-ui/src/utils', () => ({ generateExcel: jest.fn() }), {
  virtual: true,
});
jest.mock(
  'apps/rahat-ui/src/utils/prev.pagination.storage',
  () => ({
    getPaginationFromLocalStorage: () => ({ page: 1, perPage: 10 }),
  }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/common',
  () => ({
    Back: () => <div>Back</div>,
    CustomPagination: () => null,
    DemoTable: () => <div>Activities table</div>,
    Heading: ({ title }: { title: string }) => <h1>{title}</h1>,
    IconLabelBtn: ({
      name,
      handleClick,
    }: {
      name: string;
      handleClick: () => void;
    }) => <button onClick={handleClick}>{name}</button>,
    NoResult: ({ message }: { message: string }) => <div>{message}</div>,
    TableLoader: () => <div>Loading</div>,
  }),
  { virtual: true },
);
jest.mock('apps/rahat-ui/src/common/filtersTags', () => () => null, {
  virtual: true,
});
jest.mock(
  'apps/rahat-ui/src/components/can',
  () => ({
    Can: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/constants/ability.constants',
  () => ({
    ACTIONS: { READ: 'read', CREATE: 'create' },
    SUBJECTS: { ACTIVITY: 'activity' },
  }),
  { virtual: true },
);

describe('phase activity list', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUseActivities.mockClear();
    mockUsePhases.mockReset();
  });

  it('does not request unfiltered activities while phases are loading', () => {
    mockUsePhases.mockReturnValue({ data: undefined, isError: false });
    render(<ActivitiesList />);
    expect(screen.getByText('Loading')).toBeTruthy();
    expect(mockUseActivities.mock.calls.every((call) => call[1] === null)).toBe(
      true,
    );
  });

  it('does not request unfiltered activities for an unknown phase', () => {
    mockUsePhases.mockReturnValue({ data: [], isError: false });
    render(<ActivitiesList />);
    expect(screen.getByText('NO_PHASES_AVAILABLE_SHORT')).toBeTruthy();
    expect(mockUseActivities.mock.calls.every((call) => call[1] === null)).toBe(
      true,
    );
  });

  it('shows an error when the phases request fails', () => {
    mockUsePhases.mockReturnValue({ data: undefined, isError: true });
    render(<ActivitiesList />);
    expect(screen.getByText('ERROR_LOADING_DATA')).toBeTruthy();
    expect(mockUseActivities.mock.calls.every((call) => call[1] === null)).toBe(
      true,
    );
  });

  it('filters by the resolved phase and preserves it when adding an activity', async () => {
    mockUsePhases.mockReturnValue({
      data: [{ uuid: 'phase-1', name: 'Readiness' }],
      isError: false,
    });
    render(<ActivitiesList />);
    await waitFor(() =>
      expect(screen.getByText('Activities table')).toBeTruthy(),
    );
    expect(
      mockUseActivities.mock.calls.some((call) => call[1]?.phase === 'phase-1'),
    ).toBe(true);
    expect(
      mockUseActivities.mock.calls.every(
        (call) => !call[1] || call[1].phase === 'phase-1',
      ),
    ).toBe(true);
    fireEvent.click(screen.getByText('ADD_ACTIVITY'));
    expect(mockPush).toHaveBeenCalledWith(
      '/projects/aa/project-1/activities/add?phaseId=phase-1&from=readiness',
    );
  });
});
