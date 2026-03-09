import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type IProps = {
  path?: string;
  isLoading?: boolean;
  className?: string;
};

export function Back({ path, isLoading, className }: IProps) {
  const router = useRouter();

  const handleClick = () => {
    if (isLoading) return;
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 mb-4 w-16 ${
        isLoading ? 'cursor-progress' : 'cursor-pointer '
      } ${className ?? ''}`}
      onClick={handleClick}
    >
      <ArrowLeft
        size={16}
        strokeWidth={2}
        className="opacity-70 hover:opacity-100"
      />
      <span>Back</span>
    </div>
  );
}
