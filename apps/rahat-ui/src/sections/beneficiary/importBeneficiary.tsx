import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

export default function ImportBeneficiary() {
  return (
    <div className="h-custom">
      <div className="h-full p-2">
        <div className="border-dashed border-2 border-primary w-full py-10 flex justify-center">
          <div>
            <Label htmlFor="file">Select file</Label>
            <Input id="file" type="file" className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
