/**
 * Pure helpers for the Bulk Upload Activities flow: header layout, Excel
 * generation/parsing, and row <-> payload mapping.
 *
 * Kept out of bulk-upload.activity.view.tsx so the React component only
 * wires state/handlers to these functions instead of mixing ExcelJS/XLSX
 * plumbing and business rules with JSX.
 */
import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

/** Columns every uploaded sheet must have, regardless of phase flags. */
export const BASE_HEADERS = [
  'Activity Title',
  'Responsibility',
  'Responsible Station',
  'Phase',
  'Category',
];

/**
 * Rows in the generated sample that get dropdown data-validation wired up.
 * Arbitrary cap — large enough for a typical bulk import, small enough that
 * writing per-cell validation in ExcelJS stays fast.
 */
export const SAMPLE_ROW_COUNT = 200;

/**
 * Lead Time / Type columns are optional and only appear when the phase the
 * user is uploading FOR needs them. That phase is decided by the entry
 * point (the "Bulk Upload" button on a phase-scoped activities list, which
 * forwards isRequiredLeadTime/isAutomatedActivity as query params) — not by
 * scanning every phase in the project, since some phase always has each
 * flag set and the columns would never hide.
 */
export const buildHeaders = (showLeadTime: boolean, showType: boolean) => {
  const headers = [...BASE_HEADERS];
  if (showLeadTime) headers.push('Lead Time', 'Time Frame');
  if (showType) headers.push('Type');
  headers.push('Description');
  return headers;
};

/** 0-based column index -> Excel column letter (0 -> A, 1 -> B, ...). */
export const colLetter = (index0based: number) => String.fromCharCode(65 + index0based);

export type RowResult = {
  row: string[];
  error: string | null;
  /** Server-ready payload for this row, or null if it failed validation. */
  payload: any;
};

/** Case/whitespace-insensitive cell lookup by header name. */
export const getCellValue = (row: string[], headers: string[], label: string) => {
  const idx = headers.findIndex((h) => h?.toLowerCase().trim() === label.toLowerCase());
  return row[idx]?.toString().trim() ?? '';
};

const hasColumn = (headers: string[], label: string) =>
  headers.some((h) => h?.toLowerCase().trim() === label.toLowerCase());

type PayloadRefs = {
  users?: { uuid?: string; name?: string; email?: string; phone?: string }[];
  phases: { uuid: string; name: string }[];
  categories: { uuid: string; name: string }[];
};

/**
 * Maps one uploaded row to the activity-create payload shape, resolving
 * Phase/Category/Responsibility text values back to UUIDs by looking them
 * up against the already-fetched reference lists (mirrors the mapping done
 * by the single-activity add form, which looks managers up by uuid instead
 * of by name since it picks from a dropdown rather than free Excel text).
 */
export const buildActivityPayload = (
  row: string[],
  headers: string[],
  { users, phases, categories }: PayloadRefs,
) => {
  const get = (label: string) => getCellValue(row, headers, label);
  const manager = users?.find((u) => u.name === get('Responsibility'));
  const phase = phases.find((p) => p.name === get('Phase'));
  const category = categories.find((c) => c.name === get('Category'));
  const hasTypeCol = hasColumn(headers, 'Type');

  // Lead Time is stored server-side as one "<value> <unit>" string (e.g.
  // "3 days"), but the sheet splits it into two columns so Excel can
  // dropdown-validate the unit independently of the free-typed number.
  const leadTimeValue = get('Lead Time');
  const timeFrame = get('Time Frame');

  return {
    title: get('Activity Title'),
    responsibleStation: get('Responsible Station'),
    leadTime: leadTimeValue ? `${leadTimeValue} ${timeFrame}`.trim() : undefined,
    description: get('Description'),
    isAutomated: hasTypeCol ? get('Type').toLowerCase() === 'automatic' : false,
    isTemplate: false,
    categoryId: category?.uuid,
    phaseId: phase?.uuid,
    manager: manager
      ? {
          id: manager.uuid?.toString(),
          name: manager.name,
          email: manager.email,
          phone: manager.phone ?? '',
        }
      : null,
    activityDocuments: [],
  };
};

/**
 * A phase that requires neither lead-time tracking nor automation can't
 * accept activities at all. Checked client-side (phases are already in
 * memory from the Zustand store, no extra request) so these rows never hit
 * the server validation endpoint.
 */
export const checkPhaseSupport = (
  row: string[],
  headers: string[],
  phases: { name: string; isRequiredLeadTime?: boolean; isAutomatedActivity?: boolean }[],
) => {
  const phaseName = getCellValue(row, headers, 'Phase');
  const phase = phases.find((p) => p.name === phaseName);
  if (phase && !phase.isRequiredLeadTime && !phase.isAutomatedActivity) {
    return `Phase "${phaseName}" does not support activity upload (no lead time or automation enabled).`;
  }
  return null;
};

type SampleSheetOptions = {
  showLeadTime: boolean;
  showType: boolean;
  userNames: string[];
  phaseNames: string[];
  categoryNames: string[];
};

/**
 * Builds the downloadable sample workbook with real in-sheet dropdowns for
 * Responsibility/Phase/Category/Type/Time Frame.
 *
 * The dropdown option lists live on a hidden "Lookups" sheet referenced by
 * cell-range formulae, because Excel's inline list validation caps out at
 * 255 characters — too short for a real user/phase/category list.
 */
export const generateSampleWorkbook = async ({
  showLeadTime,
  showType,
  userNames,
  phaseNames,
  categoryNames,
}: SampleSheetOptions) => {
  const sampleHeaders = buildHeaders(showLeadTime, showType);
  const responsibilityCol = colLetter(sampleHeaders.indexOf('Responsibility'));
  const phaseCol = colLetter(sampleHeaders.indexOf('Phase'));
  const categoryCol = colLetter(sampleHeaders.indexOf('Category'));
  const typeColIdx = sampleHeaders.indexOf('Type');
  const timeFrameColIdx = sampleHeaders.indexOf('Time Frame');

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('Activities');
  sheet.addRow(sampleHeaders);
  sheet.columns = sampleHeaders.map(() => ({ width: 25 }));

  const lookupSheet = wb.addWorksheet('Lookups');
  lookupSheet.state = 'veryHidden';
  userNames.forEach((name, i) => (lookupSheet.getCell(`A${i + 1}`).value = name));
  phaseNames.forEach((name, i) => (lookupSheet.getCell(`B${i + 1}`).value = name));
  categoryNames.forEach((name, i) => (lookupSheet.getCell(`C${i + 1}`).value = name));
  lookupSheet.getCell('D1').value = 'Automatic';
  lookupSheet.getCell('D2').value = 'Manual';
  lookupSheet.getCell('E1').value = 'Days';
  lookupSheet.getCell('E2').value = 'Hours';

  // Applies the same list-validation rule to every data row of one column;
  // pulled into a helper since Responsibility/Phase/Category/Type/Time Frame
  // all need the identical 200-row loop, just against a different range.
  const setListValidation = (col: string | null, range: string) => {
    if (!col) return;
    for (let row = 2; row <= SAMPLE_ROW_COUNT + 1; row++) {
      sheet.getCell(`${col}${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [range],
        showErrorMessage: true,
        error: 'Please select a value from the dropdown list.',
      };
    }
  };

  setListValidation(responsibilityCol, `Lookups!$A$1:$A$${userNames.length}`);
  setListValidation(phaseCol, `Lookups!$B$1:$B$${phaseNames.length}`);
  setListValidation(categoryCol, `Lookups!$C$1:$C$${categoryNames.length}`);
  setListValidation(typeColIdx !== -1 ? colLetter(typeColIdx) : null, `Lookups!$D$1:$D$2`);
  setListValidation(
    timeFrameColIdx !== -1 ? colLetter(timeFrameColIdx) : null,
    `Lookups!$E$1:$E$2`,
  );

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

/** Triggers a browser download for an in-memory Blob (no server round-trip). */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Parses an uploaded sheet into a header row + data rows, dropping
 * fully-empty rows and checking the required headers are present. Returns
 * an error message instead of throwing so the caller can toast it directly.
 */
export const parseUploadedSheet = (
  binaryString: string | ArrayBuffer,
): { headers: string[]; rows: string[][] } | { error: string } => {
  const wb = XLSX.read(binaryString, { type: 'binary' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];

  const filteredData = rawData.filter((row) =>
    row.some((cell) => cell !== null && cell !== undefined && cell !== ''),
  );

  if (filteredData.length === 0) {
    return { error: 'No data found in the file' };
  }

  const fileHeaders = filteredData[0].map((h) => h?.toString() ?? '');
  const normalizedHeaders = fileHeaders.map((h) => h.toLowerCase().trim());

  // Description is intentionally NOT required — older exported reports
  // (e.g. the activities list "Download" report) don't have it, and a
  // missing description is just treated as "".
  const missing = BASE_HEADERS.map((h) => h.toLowerCase()).find(
    (required) => !normalizedHeaders.includes(required),
  );
  if (missing) {
    return {
      error: `File is missing the required column: "${missing}". Download the sample file for reference.`,
    };
  }

  if (filteredData.length === 1) {
    return { error: 'No activities found in the file' };
  }

  return { headers: fileHeaders, rows: filteredData.slice(1) };
};

/** Builds and downloads the annotated "Remarks" sheet for failed rows. */
export const downloadErrorsSheet = (headers: string[], results: RowResult[]) => {
  const wsData = [
    [...headers, 'Remarks'],
    ...results.map((r) => [...r.row, r.error ?? '']),
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Errors');
  XLSX.writeFile(wb, 'Activity_Bulk_Upload_Errors.xlsx');
};
