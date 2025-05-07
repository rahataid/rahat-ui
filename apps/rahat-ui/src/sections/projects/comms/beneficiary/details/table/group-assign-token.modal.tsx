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
  handleSubmit: (numberOfTokens: string) => void;
};

export default function GroupAssignToken({ handleSubmit }: IProps) {
  const [token, setToken] = useState('');
  const handleInputChange = (e: any) => {
    setToken(e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3 items-center cursor-pointer">
            <Button className="">
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
              You are assigning {token} tokens
              {/* {beneficiary?.name} */}
            </div>
            <Separator className="my-2" />
          </>
        ) : null}
        <DialogFooter>
          <Button disabled={false} onClick={() => handleSubmit(token)}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
