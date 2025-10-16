import { useCreateBudget } from '@rahat-ui/query';
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

export default function Budget({}: {}) {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'NPR',
  });

  const id = useParams().id as UUID;
  const router = useRouter();
  const createBudget = useCreateBudget(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBudget.mutateAsync({
      amount: formData.amount.toString(),
      type: 'cash-tracker',
    });

    setFormData({
      amount: '',
      currency: 'NPR',
    });
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
        <h1 className="text-2xl font-bold">Create Budget</h1>
        <p className="text-sm text-gray-500">
          Fill the form below to create budget
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <Label>Amount</Label>
          <div className="flex gap-2 w-full">
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NPR">NPR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter amount"
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
    </div>
  );
}
