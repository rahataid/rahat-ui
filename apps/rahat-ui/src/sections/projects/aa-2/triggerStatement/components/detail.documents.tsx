import { FilePreview, Heading } from 'apps/rahat-ui/src/common';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useTranslations } from 'next-intl';

type IProps = {
  triggerDocuments: any[];
  date: string;
};

export function DocumentsSection({ triggerDocuments, date }: IProps) {
  const formatDate = useDateFormat();
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="p-4 border rounded-sm shadow">
      <Heading
        title={t('DOCUMENT')}
        titleStyle="text-lg/7"
        description={t('LIST_OF_ALL_UPLOADED_DOCUMENTS')}
      />
      <div className="grid grid-cols-2 gap-3">
        {triggerDocuments?.map((d: any) => (
          <div
            key={d.mediaURL}
            className="p-4 rounded-sm shadow border flex gap-2 items-center hover:shadow-md"
          >
            <FilePreview
              url={d.mediaURL}
              fileName={d.fileName}
              className="shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm/6 truncate">{d.fileName}</p>
              <p className="text-sm/4 text-muted-foreground">
                {formatDate(date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
