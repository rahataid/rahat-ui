import {
  PROJECT_SETTINGS_KEYS,
  useCreateBudget,
  useInitateInkindTransfer,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { UUID } from 'crypto';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

export default function Stock({}: {}) {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'Hygiene Kits',
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const id = useParams().id as UUID;
  const router = useRouter();
  const createBudget = useCreateBudget(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    await createBudget.mutateAsync({
      amount: formData.amount.toString(),
      type: 'inkind-tracker',
    });

    setFormData({
      amount: '',
      currency: 'Hygiene Kits',
    });
    setShowConfirmDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <button
          className="text-sm text-gray-500 mb-2"
          onClick={() => router.back()}
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold">Create Stock</h1>
        <p className="text-sm text-gray-500">
          Fill the form below to create stock
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <Label>Amount</Label>
          <div className="flex gap-2 w-full">
            <Select
              defaultValue="Hygiene Kits"
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger className="w-34">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem defaultChecked={true} value="Hygiene Kits">
                  Hygiene Kits
                </SelectItem>
                <SelectItem value="Food Packages">Food Packages</SelectItem>
                <SelectItem value="Water Packages">Water Packages</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="flex-1"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Clear
          </Button>
          <Button
            type="submit"
            disabled={createBudget.isPending || !formData.amount}
          >
            {createBudget.isPending ? <span>Submitting...</span> : 'Confirm'}
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">Create Stock</DialogTitle>
            <DialogDescription className="text-center text-base text-gray-700 mt-2">
              Are you sure you want to create this stock?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-gray-100 rounded-lg px-6 py-4 w-full text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formData.amount} {formData.currency}
              </div>
              <div className="text-sm text-gray-700 mt-1">Stock Created</div>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirm}
              disabled={createBudget.isPending}
            >
              {createBudget.isPending ? 'Creating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
