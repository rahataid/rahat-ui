## 📌 Description

Adds Bulk Upload for AA-project activities: a sample-Excel download with in-sheet dropdowns (responsibility/phase/category/type/time-frame), file upload + client/server validation, a color-coded preview table, error-row download, and submit (all rows or only valid rows). Also makes activity report downloads round-trip-compatible so a downloaded report can be re-uploaded via bulk-upload into another project (consistent header names, optional Description column).

---

## ✅ Checklist

- [x] No `console.log` or debug code left
- [x] Proper error handling implemented
- [x] Loading states handled (if needed)
- [x] API calls handled safely
- [x] No unnecessary code or comments
- [x] Self-reviewed code for logic, edge cases, and potential issues

---

## 🎯 Type of Change

- [ ] Bug fix
- [x] New feature
- [ ] UI update
- [ ] Refactor
- [ ] Performance improvement

---

## 📸 Before / After

### Before
<!-- Add screenshots -->

### After
<!-- Add screenshots -->

---

## 🧪 How to Test

1. Go to a phase's Activities list → click **Bulk Upload**.
2. Click **Download Sample**, fill a few rows using the in-sheet dropdowns, save.
3. Upload the file, click **Validate** — confirm valid rows show green, invalid rows show red with the error reason on hover.
4. With a mix of valid/invalid rows, click **Submit Valid Rows** and confirm only the valid ones are created; with all-valid rows, confirm **Submit** creates everything and redirects.
5. Click **Download Errors** on a failed validation and confirm the error sheet has a Remarks column.
6. From the Activities list, click **Download** (report), then re-upload that exported file into Bulk Upload for a different project and confirm it validates without "missing required column" errors.

---

## ⚠️ Notes for Reviewer

- Lead Time/Type columns are shown based on the originating phase's `isRequiredLeadTime`/`isAutomatedActivity` flags passed via URL query params from the phase-scoped Bulk Upload button — not derived by scanning all phases.
- Canonical header is **"Responsible Station"** (not "Responsibility Station") — kept consistent across all 3 report exporters and the bulk-upload importer.
- Description column is optional in uploads (defaults to `""`) since older exported reports don't include it.
- Pure Excel/payload logic lives in `bulk-upload.utils.ts`, separate from the view component.
