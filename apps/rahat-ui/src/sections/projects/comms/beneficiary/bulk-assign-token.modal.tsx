import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useState } from 'react';
import { BadgePlus } from 'lucide-react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';


type IProps = {
  beneficiaries: number;
  handleSubmit: (numberOfTokens: string) => void;
  loading: boolean;
};

export default function BulkAssignToken({
  beneficiaries,
  handleSubmit,
  loading,
}: IProps) {
  const [token, setToken] = useState('');
  const totalTokens = token && beneficiaries ? token * beneficiaries : 'n/a';
  const handleInputChange = (e: any) => {
    setToken(e.target.value);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3 items-center cursor-pointer">
            <BadgePlus size={18} strokeWidth={1.5} />
            <p>Assign Token</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Token</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start gap-2">
          <div>
            <Label htmlFor="token" className="text-muted-foreground mb-2">
              No.of Token
            </Label>
          </div>
          <div>
            <Input value={token} onChange={handleInputChange} id="token" />
          </div>
        </div>
        <Separator className="my-2" />
        {token ? (
          <>
            <div className="flex items-center justify-between text-muted-foreground text-base">
              <p>Number of token</p>
              <p className="text-primary">{token || 'n/a'}</p>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-base">
              <p>Number of beneficiaries</p>
              <p className="text-primary">{beneficiaries || 'n/a'}</p>
            </div>
            <Separator className="my-2" />

            <div className="flex items-center justify-between text-muted-foreground text-base">
              <p>Total tokens to be assigned</p>
              <p className="text-primary">{totalTokens}</p>
            </div>
          </>
        ) : null}
        <Separator className="my-2" />
        <DialogFooter>
          <Button
            disabled={loading || token === '0'}
            onClick={() => handleSubmit(token)}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
