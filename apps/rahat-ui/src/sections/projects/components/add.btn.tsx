import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Plus } from 'lucide-react';

type IProps = {
  path: string;
  name: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  className?: string;
};

export default function AddButton({
  path,
  name,
  variant = 'default',
  className = '',
}: IProps) {
  const router = useRouter();
  const t = useTranslations('GLOBAL');
  return (
    <Button
      variant={variant}
      type="button"
      onClick={() => router.push(path)}
      className={className}
    >
      <Plus size={18} className="mr-1" /> {t('ADD_PLACEHOLDER', { name })}
    </Button>
  );
}
