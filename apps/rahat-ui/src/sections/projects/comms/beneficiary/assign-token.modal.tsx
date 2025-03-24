import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { BadgePlus } from 'lucide-react';
import { useState } from 'react';

type IProps = {
  beneficiary: any;
  handleSubmit: (numberOfTokens: string) => void;
  loading: boolean;
};

export default function AssignToken({
  beneficiary,
  handleSubmit,
  loading,
}: IProps) {
  const [token, setToken] = useState('');
  const handleInputChange = (e: any) => {
    setToken(e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3 items-center cursor-pointer">
            <Button className="dark:bg-secondary dark:text-white bg-sky-100 text-blue-600 felx w-96 items-center gap-2 hover:bg-sky-200">
              <BadgePlus size={18} strokeWidth={1.5} />
              <p>Assign Token</p>
            </Button>
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
        {token ? (
          <>
            <Separator className="my-2" />
            <div className="flex items-center justify-between text-muted-foreground text-base">
              You are assigning {token} tokens to {beneficiary?.name}
            </div>
            <Separator className="my-2" />
          </>
        ) : null}
        <DialogFooter>
          <Button disabled={loading} onClick={() => handleSubmit(token)}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
