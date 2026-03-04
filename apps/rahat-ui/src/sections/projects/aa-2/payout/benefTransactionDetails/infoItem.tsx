import { useProjectSettingsStore, useProjectStore } from '@rahat-ui/query';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { getStellarTxUrl } from 'apps/rahat-ui/src/utils/stellar';
import { Copy, CopyCheckIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function InfoItem({
  label,
  value,
  children,
  link = false,
  copyable = false, // ⬅️ New prop to control copyability
  isLoading,
  failed = false,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  link?: boolean;
  copyable?: boolean;
  isLoading?: boolean;
  failed?: boolean;
}) {
  const { id } = useParams();
  const projectId = id as string;
  const { clickToCopy, copyAction } = useCopy();
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const project = useProjectStore((p) => p.singleProject);

  return (
    <div className="space-y-1 break-words">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center space-x-1">
        {value && (
          <>
            {link ? (
              <a
                href={`https://sepolia.basescan.org/tx/${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-500 hover:underline cursor-pointer truncate w-24"
              >
                {value}
              </a>
            ) : (
              <span
                className={`text-base ${failed && 'text-red-400'} ${
                  copyable ? 'truncate w-24' : ''
                }`}
              >
                {value}
              </span>
            )}

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
