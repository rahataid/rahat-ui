'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uniqueField: string;
  onUniqueFieldChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
};

export default function BulkUpdateDialog({
  open,
  onOpenChange,
  uniqueField,
  onUniqueFieldChange,
  onFileChange,
  onUpload,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Upload File</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col space-y-4">
              <input
                type="file"
                onChange={(e) =>
                  onFileChange(e.target.files?.[0] ?? null)
                }
                className="border rounded p-2"
              />
              <div className="flex flex-col space-y-2 mt-4 text-left">
                <Label className="text-sm font-medium text-foreground">
                  Unique Field
                </Label>
                <Select value={uniqueField} onValueChange={onUniqueFieldChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unique field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="govtIDNumber">Govt ID Number</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="koboId">Kobo ID</SelectItem>
                    <SelectItem value="none">--- None ---</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={async () => {
              onOpenChange(false);
              await onUpload();
            }}
          >
            Upload
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
