import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { AlertTriangle, Info } from 'lucide-react';

interface UniqueFieldSelectorProps {
  availableFields: string[];
  selectedFields: string[];
  forceInsert: boolean;
  onChange: (fields: string[]) => void;
  onForceInsertChange: (value: boolean) => void;
  globalDefault?: string;
}

export default function UniqueFieldSelector({
  availableFields,
  selectedFields,
  forceInsert,
  onChange,
  onForceInsertChange,
  globalDefault,
}: UniqueFieldSelectorProps) {
  const toggle = (field: string) => {
    if (selectedFields.includes(field)) {
      onChange(selectedFields.filter((f) => f !== field));
    } else {
      onChange([...selectedFields, field]);
    }
  };

  const handleSkipValidationChange = (checked: boolean) => {
    onForceInsertChange(checked);
    if (checked) onChange([]);
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 mb-4 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Info size={15} className="shrink-0 text-blue-500" />
        <p className="text-sm font-mediumxs text-blue-800">
          Select Unique Fields for Duplicate Detection
        </p>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1">
        {availableFields.length === 0 ? (
          <p className="text-sm text-blue-600">
            No unique fields configured. Go to the{' '}
            <a href="/field-definitions" className="underline font-medium">
              Field Definitions
            </a>{' '}
            page to mark fields as unique.
          </p>
        ) : (
          availableFields.map((field) => (
            <label
              key={field}
              className={`flex items-center gap-2 ${
                forceInsert ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
              }`}
            >
              <Checkbox
                checked={selectedFields.includes(field)}
                onCheckedChange={() => toggle(field)}
                id={`unique-field-${field}`}
                disabled={forceInsert}
              />
              <span className="text-sm text-blue-800 font-mono">{field}</span>
            </label>
          ))
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={forceInsert}
            onCheckedChange={(checked) => handleSkipValidationChange(!!checked)}
            id="unique-field-skip-validation"
          />
          <span className="text-sm text-blue-800 font-mono">
            Skip Validation
          </span>
        </label>
      </div>

      {!forceInsert &&
        selectedFields.length === 0 &&
        availableFields.length > 0 && (
          <div className="flex items-center gap-2 mt-2 text-amber-700">
            <AlertTriangle size={13} className="shrink-0" />
            <p className="text-xs">
              No unique fields selected — duplicates won&apos;t be detected.
            </p>
          </div>
        )}

      {globalDefault && (
        <p className="text-xs text-blue-500 mt-2">
          Global default: {globalDefault}
        </p>
      )}
    </div>
  );
}
