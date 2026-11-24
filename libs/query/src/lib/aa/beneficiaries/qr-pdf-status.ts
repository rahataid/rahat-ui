export function isQrPdfInProgress(status?: string | null) {
  return status === 'pending' || status === 'processing';
}
