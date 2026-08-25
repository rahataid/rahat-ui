# Session Notes: User-Selectable Unique Fields on Beneficiary Import

**Branch:** `editable-row`
**Working directory:** `apps/community-tool-ui/src/sections/beneficiary/import/`

---

## What Was Built

The beneficiary import flow previously read unique fields only from the global `UNIQUE_FIELDS` setting (a comma-separated string stored in community settings, e.g. `email,phone,govtIDNumber`). These were displayed as read-only info tags on the SELECTION screen.

**New feature:** On the VALIDATION screen, the user can now check/uncheck which fields should be used for duplicate detection _for this specific import session_. The selection is sent to the backend with the validate/import API call.

---

## User Flow (After Change)

```
SELECTION screen
  → User picks Excel file
  → Shows global UNIQUE_FIELDS as read-only info (unchanged)
  → Clicks "Go"

VALIDATION screen
  → User maps Excel columns → target fields (existing behaviour)
  → NEW: UniqueFieldSelector renders below the mapping table
      - Checkboxes for each mapped target field (fallback: all field definitions)
      - Pre-checked from global UNIQUE_FIELDS setting
      - Amber warning shown if user unchecks everything
      - Global default shown as a hint at the bottom
  → User adjusts unique field selection
  → Clicks "Validate Data"
      - selectedUniqueFields sent to backend as uniqueFields: "email,phone"

IMPORT_DATA screen
  → Duplicate highlighting (orange cells) uses selectedUniqueFields, not global setting
```

---

## Files Changed

### 1. NEW FILE — `UniqueFieldSelector.tsx`

**Path:** `apps/community-tool-ui/src/sections/beneficiary/import/UniqueFieldSelector.tsx`

Checkbox multi-select component. Props:

```ts
interface UniqueFieldSelectorProps {
  availableFields: string[]; // API-driven — from useUniqueFieldDefinitionsList
  selectedFields: string[]; // controlled state from Beneficiary.tsx
  forceInsert: boolean; // separate boolean state for skip-validation
  onChange: (fields: string[]) => void;
  onForceInsertChange: (value: boolean) => void;
  globalDefault?: string; // "email,phone" — shown as hint only
}
```

**Available fields are now API-driven** via `useUniqueFieldDefinitionsList` (no static list). Field names render as-is from the API response — no `FIELD_LABELS` map.

**"Skip Validation"** is a fixed extra checkbox always rendered after the API fields. It is NOT part of `uniqueFields` — it controls the separate `forceInsert` boolean.

Key behaviours:

- Each field checkbox toggles the field in/out of `selectedFields`
- When "Skip Validation" is checked: `forceInsert` → `true`, `selectedFields` is cleared, all other checkboxes are disabled
- When "Skip Validation" is unchecked: `forceInsert` → `false`, user can pick fields again
- If `availableFields` is empty → shows "No unique fields configured. Contact your administrator."
- If `selectedFields` is empty and `forceInsert` is false → amber warning: "No unique fields selected — duplicates won't be detected"
- `globalDefault` displayed as a small hint at bottom

---

### 2. MODIFIED — `Beneficiary.tsx`

**Path:** `apps/community-tool-ui/src/sections/beneficiary/import/Beneficiary.tsx`

#### a) New query added

```ts
import { useUniqueFieldDefinitionsList } from '@rahat-ui/community-query';

const { data: uniqueFieldDefs } = useUniqueFieldDefinitionsList();
const uniqueFieldNames: string[] = (uniqueFieldDefs?.data ?? []).map(
  (f: { name: string }) => f.name,
);
```

#### b) New `forceInsert` state (alongside `selectedUniqueFields`)

```ts
const [selectedUniqueFields, setSelectedUniqueFields] = React.useState<
  string[]
>([]);
const [forceInsert, setForceInsert] = React.useState(false);

// isForceInsert now reads from forceInsert state, not selectedUniqueFields
const isForceInsert = forceInsert;
```

#### c) API payload separates `forceInsert` from `uniqueFields` (inside `validateAndImortBeneficiary`)

```ts
const sourcePayload = {
  action,
  name: importSource,
  importId,
  groupName,
  forceInsert, // ← boolean field
  uniqueFields: forceInsert ? [] : selectedUniqueFields, // ← empty when skipping
  fieldMapping: { data: final_mapping, sourceTargetMappings: mappings },
};
```

#### d) VALIDATION screen JSX — UniqueFieldSelector now uses API fields + new props

```tsx
{
  rawData.length > 0 && (
    <UniqueFieldSelector
      availableFields={uniqueFieldNames}
      selectedFields={selectedUniqueFields}
      forceInsert={forceInsert}
      onChange={setSelectedUniqueFields}
      onForceInsertChange={setForceInsert}
      globalDefault={getUniqueField}
    />
  );
}
```

---

### 3. MODIFIED — `fieldDefinitions.query.ts` + `config.ts`

**Path:** `libs/community-query/src/fieldDefinitions/fieldDefinitions.query.ts`

New query added:

```ts
export const useUniqueFieldDefinitionsList = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  return useQuery(
    {
      queryKey: [TAGS.LIST_UNIQUE_FIELD_DEFINITIONS],
      queryFn: () => fieldDefClient.listUnique(),
    },
    queryClient,
  );
};
```

New TAGS entry in `libs/community-query/src/config.ts`:

```ts
LIST_UNIQUE_FIELD_DEFINITIONS: 'list_unique_field_definitions',
```

SDK requirement: `@rahataid/community-tool-sdk` >= `0.0.43` — `listUnique()` was added in that version.

---

## Files NOT Changed

| File                     | Reason                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| `FilterBox.tsx`          | Still shows global unique fields as read-only info on SELECTION screen — intentionally unchanged |
| `AddToQueue.tsx`         | No logic change needed — already reads from the `uniqueFields` prop string                       |
| `ColumnMappingTable.tsx` | No change                                                                                        |

---

## What the Backend Receives

On both VALIDATE and IMPORT actions, the payload now includes:

```json
{
  "action": "VALIDATE",
  "name": "EXCEL",
  "importId": "filename.xlsx",
  "groupName": null,
  "forceInsert": false,
  "uniqueFields": ["phone"],
  "fieldMapping": { "data": [...] }
}
```

When the user selects "Skip Validation":

```json
{
  "forceInsert": true,
  "uniqueFields": []
}
```

`uniqueFields` is now an **array** (not a comma-separated string). `forceInsert: true` signals the backend to skip duplicate detection and insert all rows regardless.

---

## Pending / Follow-up

- Backend needs to consume the new `uniqueFields` field from the payload (if not already done)
- Consider resetting `selectedUniqueFields` to global default when the user clicks "Back" to re-select a file (currently state persists across re-imports in the same session)
- The SELECTION screen info box still says "Go to Settings to change these" — may want to update that copy to mention that fields can also be overridden per import on the next screen

---

## Edit & Submit Feature (Group Detail)

**Branch:** `display-version`

**Files:**

- `apps/community-tool-ui/src/sections/group/groupdetails.tsx` (refactored — now lean orchestrator)
- `apps/community-tool-ui/src/sections/group/EditSubmitDialog.tsx` (new)
- `apps/community-tool-ui/src/sections/group/DownloadDialog.tsx` (new)
- `apps/community-tool-ui/src/sections/group/BulkUpdateDialog.tsx` (new)

---

### Overview

A new **"Edit & Submit"** option in the Group Detail `⋮` dropdown that lets users edit beneficiary fields inline in a table and submit without downloading/uploading a file.

---

### User Flow

```text
Group Detail page → ⋮ menu → "Edit & Submit"
  → Calls download API to fetch ALL beneficiaries (no pagination limit)
  → Dialog opens with editable table
      - Columns: only fields present in the data that match active field-definitions
      - uuid, createdAt, updatedAt, createdBy are read-only
      - latitude and longitude are excluded from the XLSX payload (float type issue)
  → User can add new columns via "+ Add column" popover (searchable)
      - Shows field-definition fields not yet in the table
      - Added columns appear for all rows with empty values (not required)
      - Added columns show an X button in the header to remove them
  → User edits cells inline
  → Clicks Submit
      - Serializes editableRows to an in-memory .xlsx file
      - Sends via FormData to updateBulkBeneficiary API with uniqueField: 'uuid'
      - On success, dialog closes
```

---

### Key Implementation Details

**Data source:** Uses `download.mutateAsync()` (same hook as the Download feature) to fetch all beneficiaries — bypasses pagination, so groups with 500+ beneficiaries load fully.

**Column filtering:** `allowedKeys` is built from `listFieldDef?.data` (active field-definitions). Only keys present in the download response AND in `allowedKeys` appear as columns (`presentKeys`). Remaining field-def keys go into `availableColumns` for the "Add column" dropdown.

**Add column:** `handleAddColumn(colKey)` — appends `colKey: ''` to every row, removes from `availableColumns`, adds to `addedColumns` set.

**Remove column:** `handleRemoveColumn(colKey)` — strips the key from every row, returns it to `availableColumns`, removes from `addedColumns`. Only user-added columns show the X button.

**Submit — extras handling:** The backend extracts primary vs. extras fields itself. The XLSX is sent flat (all columns at top level) — no re-packing needed on the frontend.

**Submit — float fields:** `latitude` and `longitude` are excluded from the XLSX via `EXCLUDE_FROM_XLSX` constant. The backend reads XLSX with `{ raw: false }` which coerces all values to strings, causing Prisma float validation to fail. Excluding them leaves the existing DB values untouched.

**uniqueField:** Hardcoded to `'uuid'` for this flow — UUID is always present and unambiguous.

**State reset:** `addedColumns` is reset to `new Set()` each time the dialog opens.

---

### API Used

```ts
// Same mutation as Bulk Update — no new hook
const updateBulkBeneficiary = useUploadBulkBeneficiaryUpdate();

await updateBulkBeneficiary.mutateAsync({
  groupUUID: uuid,
  data: formData, // FormData with .xlsx file
  uniqueField: 'uuid',
});
```

---

### Refactor: groupdetails.tsx → 3 dialog components

The original `groupdetails.tsx` (~920 lines) was split into:

| Component          | File                   | Responsibility                             |
| ------------------ | ---------------------- | ------------------------------------------ |
| `DownloadDialog`   | `DownloadDialog.tsx`   | Field selector + XLSX download             |
| `BulkUpdateDialog` | `BulkUpdateDialog.tsx` | File upload + unique field select          |
| `EditSubmitDialog` | `EditSubmitDialog.tsx` | Inline editable table + add/remove columns |

`groupdetails.tsx` now owns only state, handlers, and wires the three dialogs via props.

---

### Known Limitation

The backend reads uploaded XLSX with `{ raw: false }`, which converts all cell values to strings. This breaks Prisma validation for float fields (`latitude`, `longitude`) and boolean fields. Current workaround: exclude `latitude`/`longitude` from the payload. If the backend adds explicit type parsing (e.g. `parseFloat(row.latitude)`), this exclusion can be removed.
