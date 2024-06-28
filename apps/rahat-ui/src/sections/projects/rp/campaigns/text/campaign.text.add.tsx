import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@rahat-ui/shadcn/src/components/ui/drawer';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
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

const transports = [
  {
    value: 'hey',
    label: 'Hey',
  },
  {
    value: 'prabhu',
    label: 'Prabhu',
  },
  {
    value: 'jagganath',
    label: 'Jagganath',
  },
];

const TextCampaignAddDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card className="flex rounded justify-center border-dashed border-2 border-primary shadow bg-card cursor-pointer hover:shadow-md ease-in duration-300">
          <CardContent className="flex items-center justify-center">
            <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mt-2">
              <Plus className="text-primary" size={20} strokeWidth={1.5} />
            </div>
          </CardContent>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="min-h-96">
        <div className="mx-auto my-auto w-[600px]">
          <DrawerHeader>
            <DrawerTitle>Add Text</DrawerTitle>
            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>
          <DrawerDescription>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[400px] justify-between mb-2"
                >
                  {value
                    ? transports.find((transport) => transport.value === value)
                        ?.label
                    : 'Select transport...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search transport..." />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {transports.map((transport) => (
                        <CommandItem
                          key={transport.value}
                          value={transport.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? '' : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === transport.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {transport.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Textarea placeholder="Type your message here." />
          </DrawerDescription>
          <DrawerFooter className="flex items-center justify-between">
            <DrawerClose asChild>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button className="w-full">Submit</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TextCampaignAddDrawer;
