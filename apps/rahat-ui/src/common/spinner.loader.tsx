import { LoaderCircle } from 'lucide-react';

export function SpinnerLoader() {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <LoaderCircle size={20} className="animate-spin" />
    </div>
  );
}
