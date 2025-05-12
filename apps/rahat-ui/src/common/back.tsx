import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type IProps = {
  path?: string;
};

export function Back({ path }: IProps) {
  const router = useRouter();

  const handleClick = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <div
      className="inline-flex gap-2 mb-4 cursor-pointer"
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
