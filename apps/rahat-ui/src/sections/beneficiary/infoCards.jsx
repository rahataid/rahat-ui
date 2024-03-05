import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@rahat-ui/shadcn/components/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

import { MoreVertical } from 'lucide-react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
// import data from '../../app/beneficiary/beneficiaryData.json';

export default function InfoCards({ data }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-2">
      <Card className="shadow-md rounded-sm">
        <CardHeader>
          <div className="flex justify-between">
            <p>Beneficiary Name</p>
            <Badge variant="outline" color="red">
              Not Approved
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <p className="text-xs">{data.walletAddress ?? 'test'}</p>
            <p className="text-sm font-normal text-muted-foreground">
              Wallet Address
            </p>
          </div>
          <div className="flex justify-between gap-8">
            <div className="flex flex-col gap-2">
              <div>
                <p>{data.bankStatus ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Bank Status
                </p>
              </div>
              <div>
                <p>{data.internetStatus ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Internet Status
                </p>
              </div>
              <div>
                <p>{data.phoneStatus ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Phone Status
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <p>{data.gender ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Gender
                </p>
              </div>

              <div>
                <p>{data.location ?? 'test'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Location
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md rounded-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <p>Claim Details</p>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical size={20} strokeWidth={1.5} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-1 flex flex-col gap-0.5 text-sm">
                  <Dialog>
                    <DialogTrigger className="hover:bg-muted p-1 rounded text-left">
                      Assign Project
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Project</DialogTitle>
                        <DialogDescription>
                          Select the project to be assigned to the beneficiary
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Projects" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Project 1</SelectItem>
                            <SelectItem value="2">Project 2</SelectItem>
                            <SelectItem value="3">Project 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                          <Button type="button" variant="ghost">
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-primary"
                        >
                          Assign
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger className="hover:bg-muted p-1 rounded text-left">
                      Assign Token
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Token</DialogTitle>
                        <DialogDescription>
                          Enter Token to the beneficiary
                        </DialogDescription>
                      </DialogHeader>
                      <Input type="text" placeholder="Token" />
                      <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                          <Button type="button" variant="ghost">
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-primary"
                        >
                          Assign
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p>Claimed</p>
              <p className="text-sm font-light">0</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Received</p>
              <p className="text-sm font-light">0</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Wallet Address</p>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-sm font-medium">87654eu87654edgh76</p>
                  </TooltipTrigger>
                  <TooltipContent className="bg-secondary ">
                    <p className="text-xs font-medium">click to copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md rounded-sm">
        <CardHeader>
          <p className="fonr-mediun text-md">Projects Involved</p>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" color="secondary" className="rounded">
            Test Project
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
