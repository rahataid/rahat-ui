export async function downloadQrPdf(fileUrl: string, fileName: string) {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`QR PDF download failed (${response.status})`);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
