import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type IProps = {
  path: string;
};

export default function Back({ path }: IProps) {
  return (
    <Link href={path}>
      <ChevronLeft
        size={25}
        strokeWidth={2}
        className="cursor-pointer opacity-70 hover:opacity-100"
      />
    </Link>
  );
}
