/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ProjectListView from './project-view';

const mockUseProjectList = jest.fn();

jest.mock(
  '@rahat-ui/query',
  () => ({
    useProjectList: () => mockUseProjectList(),
  }),
  { virtual: true },
);
jest.mock(
  'next-intl',
  () => ({
    useTranslations: () => (key: string) => key,
  }),
  { virtual: true },
);
jest.mock(
  '@rahat-ui/shadcn/src/components/ui/button',
  () => ({ Button: () => null }),
  { virtual: true },
);
jest.mock(
  '@rahat-ui/shadcn/src/components/ui/input',
  () => ({
    Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
      <input {...props} />
    ),
  }),
  { virtual: true },
);
jest.mock(
  '@rahat-ui/shadcn/src/components/ui/scroll-area',
  () => ({
    ScrollArea: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  }),
  { virtual: true },
);
jest.mock('../../hooks/use-boolean', () => ({
  useBoolean: () => ({ value: false, onTrue: jest.fn(), onFalse: jest.fn() }),
}));
jest.mock('../../sections/projects', () => ({
  ProjectCard: ({ title }: { title: string }) => <div>{title}</div>,
}));
jest.mock('./addProject.confirm', () => () => null);
jest.mock('../../common', () => ({
  SpinnerLoader: () => <div>Loading projects</div>,
}));

describe('project list loading', () => {
  beforeEach(() => {
    localStorage.clear();
    mockUseProjectList.mockReset();
  });

  it('shows loading instead of a false empty state', () => {
    mockUseProjectList.mockReturnValue({ isLoading: true });
    render(<ProjectListView />);
    expect(screen.getByText('Loading projects')).toBeTruthy();
    expect(screen.queryByText('NO_PROJECTS_FOUND')).toBeNull();
  });

  it('shows an error instead of a false empty state', () => {
    mockUseProjectList.mockReturnValue({ isLoading: false, isError: true });
    render(<ProjectListView />);
    expect(screen.getByRole('alert').textContent).toBe('SOMETHING_WENT_WRONG');
    expect(screen.queryByText('NO_PROJECTS_FOUND')).toBeNull();
  });

  it('reports an invalid project rather than showing an empty list', () => {
    mockUseProjectList.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: [{ name: 'Incomplete' }] },
    });
    render(<ProjectListView />);
    expect(screen.getByRole('alert').textContent).toBe('SOMETHING_WENT_WRONG');
    expect(screen.queryByText('NO_PROJECTS_FOUND')).toBeNull();
  });

  it('renders loaded projects and preserves filtering on refresh', () => {
    mockUseProjectList.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        data: [
          { uuid: '1', name: 'Alpha', type: 'aa', status: 'ACTIVE' },
          { uuid: '2', name: 'Beta', type: 'aa', status: 'ACTIVE' },
        ],
      },
    });
    const { rerender } = render(<ProjectListView />);
    fireEvent.change(screen.getByPlaceholderText('SEARCH_PROJECT_BY_NAME'), {
      target: { value: 'Alpha' },
    });
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.queryByText('Beta')).toBeNull();
    rerender(<ProjectListView />);
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.queryByText('Beta')).toBeNull();
  });

  it('shows an empty state once an empty response has loaded', () => {
    mockUseProjectList.mockReturnValue({
      isLoading: false,
      data: { data: [] },
    });
    render(<ProjectListView />);
    expect(screen.getByText('NO_PROJECTS_FOUND')).toBeTruthy();
  });
});
