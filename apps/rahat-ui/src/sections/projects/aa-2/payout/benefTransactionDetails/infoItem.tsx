import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { Copy, CopyCheckIcon } from 'lucide-react';

export default function InfoItem({
  label,
  value,
  children,
  link = false,
  copyable = false, // ⬅️ New prop to control copyability
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  link?: boolean;
  copyable?: boolean;
}) {
  const { clickToCopy, copyAction } = useCopy();

  return (
    <div className="space-y-1 break-words">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-center space-x-1">
        {value && (
          <>
            <span
              className={`text-sm ${
                link ? 'text-blue-500 hover:underline cursor-pointer' : ''
              }`}
            >
              {value}
            </span>
            {copyable &&
              (copyAction === 1 ? (
                <CopyCheckIcon
                  className="w-4 h-4 text-muted-foreground cursor-pointer"
                  color="green"
                />
              ) : (
                <Copy
                  className="w-4 h-4 text-muted-foreground cursor-pointer"
                  onClick={() => clickToCopy(value, 1)}
                />
              ))}
          </>
        )}
        {children}
      </div>
    </div>
  );
}
