import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@rahat-ui/shadcn/src/utils';

type IProps = {
  path?: string;
  isLoading?: boolean;
  onBack?: () => void;
  className?: string;
};

export function Back({ path, isLoading, onBack, className }: IProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isLoading) return;
    if (onBack) {
      onBack();
      return;
    }
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={cn(
        'inline-flex gap-1 mb-2 w-fit items-center',
        isLoading ? 'cursor-progress' : 'cursor-pointer',
        className,
      )}
      onClick={handleClick}
    >
      <ArrowLeft
        strokeWidth={2}
        className="size-[clamp(14px,1.4vw,20px)] opacity-70 hover:opacity-100"
      />
      <span className="text-[clamp(11px,1vw,16px)]">Back</span>
    </div>
  );
}
