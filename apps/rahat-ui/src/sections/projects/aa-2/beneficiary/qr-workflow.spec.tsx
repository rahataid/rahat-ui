/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BeneficiaryGroupsDetails from './beneficiary.groups.details';
import { downloadQrPdf } from './qr-pdf-download';
import { toast } from 'react-toastify';

let mockQr: { status?: string; fileUrl?: string; error?: string } | null = null;
let mockQrError = false;
const mockRefetch = jest.fn();
const mockGenerate = jest.fn();
const mockRegenerate = jest.fn();

jest.mock(
  'next-intl',
  () => ({ useTranslations: () => (key: string) => key }),
  { virtual: true },
);
jest.mock(
  'next/navigation',
  () => ({ useParams: () => ({ id: 'project', groupId: 'group' }) }),
  { virtual: true },
);
jest.mock(
  '@rahat-ui/query',
  () => ({
    useSingleBeneficiaryGroup: () => ({
      data: { name: 'Group', groupedBeneficiaries: [] },
    }),
    useGetBeneficiariesQr: () => ({
      data: mockQr,
      isPending: false,
      isError: mockQrError,
      refetch: mockRefetch,
    }),
    useGenerateQrPdf: () => ({ mutate: mockGenerate, isPending: false }),
    useRegenerateQrPdf: () => ({ mutate: mockRegenerate, isPending: false }),
    useExportBeneficiariesExcel: () => ({
      mutate: jest.fn(),
      isPending: false,
    }),
    useGetSponsorshipStatusForGroup: () => ({}),
    useRetrySponsorshipForGroup: () => ({ mutate: jest.fn() }),
  }),
  { virtual: true },
);
jest.mock('./columns', () => ({
  useProjectBeneficiaryGroupDetailsTableColumns: () => [
    { accessorKey: 'walletAddress' },
  ],
}));
jest.mock(
  'apps/rahat-ui/src/common',
  () => ({
    ClientSidePagination: () => null,
    DataCard: () => null,
    DemoTable: () => null,
    HeaderWithBack: () => null,
    SearchInput: () => null,
    SpinnerLoader: () => null,
  }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/utils/i18n/number',
  () => ({ useNumberFormat: () => String }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/utils/exportToExcle',
  () => ({ exportToExcel: jest.fn() }),
  { virtual: true },
);
jest.mock(
  '@rahat-ui/shadcn/src/components/ui/button',
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
  '@rahat-ui/shadcn/src/components/ui/dropdown-menu',
  () => ({
    DropdownMenu: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DropdownMenuItem: ({
      children,
      onSelect,
    }: {
      children: React.ReactNode;
      onSelect?: () => void;
    }) => <div onClick={onSelect}>{children}</div>,
  }),
  { virtual: true },
);
jest.mock('./qr-otp.dialog', () => ({
  QrOtpDialog: ({
    open,
    onConfirm,
  }: {
    open: boolean;
    onConfirm: (value: object) => void;
  }) =>
    open ? (
      <button
        onClick={() =>
          onConfirm({
            includeOtp: true,
            onlyUnphonedBeneficiaries: false,
            pdfFields: [],
          })
        }
      >
        Confirm options
      </button>
    ) : null,
}));
jest.mock('./qr-pdf-download', () => ({ downloadQrPdf: jest.fn() }));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));

beforeEach(() => {
  mockQr = null;
  mockQrError = false;
  jest.clearAllMocks();
  mockRefetch.mockImplementation(async () => ({ data: mockQr, isError: false }));
});

it('shows a disabled generation indicator for queued and processing jobs', () => {
  mockQr = { status: 'pending' };
  const { rerender } = render(<BeneficiaryGroupsDetails />);
  expect((screen.getByText('GENERATING') as HTMLButtonElement).disabled).toBe(
    true,
  );
  expect(screen.queryByText('GENERATE_QR')).toBeNull();
  mockQr = { status: 'processing' };
  rerender(<BeneficiaryGroupsDetails />);
  expect((screen.getByText('GENERATING') as HTMLButtonElement).disabled).toBe(
    true,
  );
});

it('downloads a completed file and offers regeneration and direct opening', async () => {
  mockQr = { status: 'completed', fileUrl: 'https://files.example/qr.pdf' };
  (downloadQrPdf as jest.Mock).mockResolvedValue(undefined);
  render(<BeneficiaryGroupsDetails />);
  fireEvent.click(screen.getByText('DOWNLOAD_QR'));
  await waitFor(() =>
    expect(downloadQrPdf).toHaveBeenCalledWith(
      mockQr?.fileUrl,
      'beneficiaries-group-qr.pdf',
    ),
  );
  expect(mockRefetch).toHaveBeenCalledTimes(1);
  expect(
    screen.getByText('OPEN_QR_PDF').closest('a')?.getAttribute('href'),
  ).toBe(mockQr.fileUrl);
  fireEvent.click(screen.getByText('REGENERATE_QR'));
  fireEvent.click(screen.getByText('Confirm options'));
  expect(mockRegenerate).toHaveBeenCalled();
});

it('shows failed jobs and lets users retry generation', () => {
  mockQr = { status: 'failed', error: 'Job failed' };
  render(<BeneficiaryGroupsDetails />);
  expect(screen.getByRole('alert').textContent).toContain('Job failed');
  fireEvent.click(screen.getByText('GENERATE_QR'));
  fireEvent.click(screen.getByText('Confirm options'));
  expect(mockGenerate).toHaveBeenCalled();
});

it('reports download errors and leaves the direct PDF link available', async () => {
  mockQr = { status: 'completed', fileUrl: 'https://files.example/qr.pdf' };
  (downloadQrPdf as jest.Mock).mockRejectedValue(new Error('CORS failure'));
  render(<BeneficiaryGroupsDetails />);
  fireEvent.click(screen.getByText('DOWNLOAD_QR'));
  await waitFor(() =>
    expect(toast.error).toHaveBeenCalledWith('FAILED_TO_DOWNLOAD_QR_PDF'),
  );
  expect(screen.getByText('OPEN_QR_PDF').closest('a')).toBeTruthy();
});

it('does not start a new job when status cannot be fetched', () => {
  mockQrError = true;
  render(<BeneficiaryGroupsDetails />);
  expect(screen.getByRole('alert').textContent).toContain(
    'FAILED_TO_LOAD_QR_STATUS',
  );
  expect(screen.queryByText('GENERATE_QR')).toBeNull();
  fireEvent.click(screen.getByText('RETRY'));
  expect(mockRefetch).toHaveBeenCalledTimes(1);
});
