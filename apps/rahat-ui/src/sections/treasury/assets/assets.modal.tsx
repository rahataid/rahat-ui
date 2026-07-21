import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  useProjectList,
  useSendFundToProject,
  useSettingsStore,
} from '@rahat-ui/query';
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
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function AssetsModal(tokenAddress: any) {
  const t = useTranslations('Treasury – Assets');
  const tg = useTranslations('GLOBAL');
  const [amount, setAmount] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<`0x${string}`>('');
  const[selectedToken,setSelectedToken] = useState<`0x${string}`>('');
  const sendFundToProject = useSendFundToProject();
  const appContracts = useSettingsStore((state) => state.contracts);
  const projects = useProjectList();

  const { contractAddress } = useParams();

  const handleSendFunds = async () => {
    if (selectedProject) {
      // Replace this with the actual function to send funds
      // console.log('Sending funds to project with address:', {
      //   amount,
      //   projectAddress: selectedProject,
      //   tokenAddress: appContracts?.RAHATTOKEN?.ADDRESS,
      //   treasuryAddress: appContracts?.RAHATTREASURY?.ADDRESS,
      // });
      await sendFundToProject.mutateAsync({
        amount,
        projectAddress: selectedProject,
        tokenAddress: selectedToken,
        treasuryAddress: appContracts?.RAHATTREASURY?.ADDRESS,
      });
    } else {
      console.log('No project selected');
    }
  };

  const handleSelectProject = (contractAddress: `0x${string}`,tokenAddress: `0x${string}`) => {
    setSelectedProject(contractAddress);
    setSelectedToken(tokenAddress);

  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
        // onClick={handleSendFunds}
        >
          <Plus className="mr-2" size={20} strokeWidth={1.25} />
          {t('SEND_FUND_TO_PROJECT')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('SEND_FUND')}</DialogTitle>
          <DialogDescription>
            {t('CHOOSE_THE_AMOUNT_AND_PROJECT_YOU')}
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
                  <CommandInput placeholder={t('SEARCH_PROJECTS')} />
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
                      //@ts-expect-error - project param type is untyped/any
                      (p) => p?.extras?.tokenAddress === selectedToken,
                    )?.name
                  : t('SELECT_A_PROJECT')}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="bg-white border border-gray-300 rounded shadow-lg">
                {projects?.data?.data?.map((project) => (
                  <DropdownMenu.Item
                    key={project?.id}
                    onSelect={() =>
                      //@ts-expect-error - project param type is untyped/any
                      handleSelectProject(project?.contractAddress,project?.extras?.tokenAddress)
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
              {t('AMOUNT')}
            </Label>
            <Input
              placeholder={t('AMOUNT')}
              className="w-full mb-4"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {selectedProject && (
            <div className="mb-4">
              {t('SELECTED_PROJECT')}{' '}
              {
                projects?.data?.data?.find(
                  (p) => p.contractAddress === selectedProject,
                )?.name
              }
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSendFunds}
            disabled={selectedToken != contractAddress}
          >
            {t('FUND_PROJECT')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
