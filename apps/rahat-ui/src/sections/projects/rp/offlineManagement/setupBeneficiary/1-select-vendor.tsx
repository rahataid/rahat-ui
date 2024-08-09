import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Step1SelectVendorProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Step1SelectVendor({}: Step1SelectVendorProps) {
  const router = useRouter();
  return (
    <div className="bg-card rounded-lg m-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            Select Vendor
          </h1>
        </div>
        <p className="text-gray-500 font-normal text-base">
          Select the vendor from to proceed forward
        </p>
      </div>
      <div className="mt-8 mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-2/3 border flex items-center justify-between rounded-md p-3">
              Select Vendor
              <ChevronDown strokeWidth={1.5} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[52rem]">
            <DropdownMenuLabel>Select Vendor</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Vendor 1</DropdownMenuItem>
              <DropdownMenuItem>Vendor 2</DropdownMenuItem>
              <DropdownMenuItem>vendor 3</DropdownMenuItem>
              <DropdownMenuItem>Vendor 4</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
