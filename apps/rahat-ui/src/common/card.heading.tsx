import { cn } from 'libs/shadcn/src';
import { TruncatedCell } from '../sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export function CardHeading({
  title,
  description,
  titleStyle,
  descriptionStyle,
  status,
  badgeStyle,
}: {
  title: string;
  description: string;
  titleStyle?: string;
  descriptionStyle?: string;
  status?: string;
  badgeStyle?: string;
}) {
  return (
    <div className="mb-4">
      <div className="font-bold mb-1  flex items-center gap-2">
        <div
          className={cn(
            !titleStyle && 'text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl',
            titleStyle,
          )}
        >
          <TruncatedCell text={title} maxLength={15} />
        </div>
        {status && <Badge className={badgeStyle}>{status}</Badge>}
      </div>
      <div className={cn('text-sm/4 text-muted-foreground', descriptionStyle)}>
        <TruncatedCell text={description} maxLength={30} />
      </div>
    </div>
  );
}
