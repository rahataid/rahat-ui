import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  useProjectList,
  useSendFundToProject,
  useSettingsStore,
} from '@rahat-ui/query';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import { cn } from '@rahat-ui/shadcn/src';

export function AssetsModal() {
  const [amount, setAmount] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<`0x${string}`>('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const sendFundToProject = useSendFundToProject();
  const appContracts = useSettingsStore((state) => state.contracts);
  const projects = useProjectList();

  const handleSendFunds = async () => {
    if (selectedProject) {
      // Replace this with the actual function to send funds
      console.log('Sending funds to project with address:', selectedProject);
      await sendFundToProject.mutateAsync({
        amount,
        projectAddress: selectedProject,
        tokenAddress: appContracts?.rahattoken?.address,
        treasuryAddress: appContracts?.rahattreasury?.address,
      });
    } else {
      console.log('No project selected');
    }
  };
  console.log('projects', projects?.data?.data);
  const handleSelectProject = (contractAddress: `0x${string}`) => {
    setSelectedProject(contractAddress);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
        // onClick={handleSendFunds}
        >
          <Plus className="mr-2" size={20} strokeWidth={1.25} />
          Send fund to project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Fund</DialogTitle>
          <DialogDescription>
            Choose the amount and project you would like to fund.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            {/* <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value || 'Select project...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search project..." />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {projects?.data?.data?.map((project) => (
                        <CommandItem
                          key={project.contractAddress}
                          value={project.contractAddress}
                          onSelect={() => {
                            handleSelectProject(project?.contractAddress);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedProject === project.contractAddress
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {project.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover> */}

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="border border-gray-300 p-2 rounded mb-4">
                {selectedProject
                  ? projects?.data?.data?.find(
                      (p) => p.contractAddress === selectedProject,
                    )?.name
                  : 'Select a project'}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="bg-white border border-gray-300 rounded shadow-lg">
                {projects?.data?.data?.map((project) => (
                  <DropdownMenu.Item
                    key={project.id}
                    onSelect={() =>
                      handleSelectProject(project.contractAddress)
                    }
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {project.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col  gap-4">
            <Label htmlFor="name" className="">
              Amount
            </Label>
            <Input
              placeholder="Amount"
              className="w-full mb-4"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {selectedProject && (
            <div className="mb-4">
              Selected Project:{' '}
              {
                projects?.data?.data?.find(
                  (p) => p.contractAddress === selectedProject,
                )?.name
              }
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSendFunds}>Fund Porject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}