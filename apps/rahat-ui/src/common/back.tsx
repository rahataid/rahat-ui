import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type IProps = {
  path?: string;
  isLoading?: boolean;
};

export function Back({ path, isLoading }: IProps) {
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
      className={`inline-flex gap-2 mb-4 w-16 ${
        isLoading ? 'cursor-progress' : 'cursor-pointer '
      } `}
      onClick={handleClick}
    >
      <ArrowLeft
        size={25}
        strokeWidth={2}
        className="opacity-70 hover:opacity-100"
      />
      <span> Back</span>
    </div>
  );
}
