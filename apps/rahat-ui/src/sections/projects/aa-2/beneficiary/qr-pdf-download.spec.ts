/** @jest-environment jsdom */
import { downloadQrPdf } from './qr-pdf-download';
import { isQrPdfInProgress } from 'libs/query/src/lib/aa/beneficiaries/qr-pdf-status';

describe('QR PDF workflow', () => {
  it('treats both queued and processing jobs as active', () => {
    expect(isQrPdfInProgress('pending')).toBe(true);
    expect(isQrPdfInProgress('processing')).toBe(true);
    expect(isQrPdfInProgress('completed')).toBe(false);
    expect(isQrPdfInProgress('failed')).toBe(false);
    expect(isQrPdfInProgress(undefined)).toBe(false);
  });

  it('downloads the fetched PDF without navigating away and releases the object URL', async () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, blob: async () => blob });
    global.fetch = fetchMock;
    URL.createObjectURL = jest.fn().mockReturnValue('blob:qr');
    URL.revokeObjectURL = jest.fn();
    const click = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        expect(this.href).toBe('blob:qr');
        expect(this.download).toBe('qr.pdf');
      });
    await downloadQrPdf('https://files.example/qr.pdf', 'qr.pdf');
    expect(fetchMock).toHaveBeenCalledWith('https://files.example/qr.pdf');
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(click).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:qr');
    click.mockRestore();
  });

  it('reports failed downloads instead of creating a file', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 403 });
    await expect(
      downloadQrPdf('https://files.example/expired', 'qr.pdf'),
    ).rejects.toThrow('QR PDF download failed (403)');
  });
});
