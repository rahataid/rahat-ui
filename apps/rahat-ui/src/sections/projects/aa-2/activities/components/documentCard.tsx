import { useTranslations } from 'next-intl';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { File } from 'lucide-react';

interface DocumentCardProps {
  fileName: string;
  date?: string;
  mediaURL?: string;
}

export default function DocumentCard({
  fileName,
  date,
  mediaURL,
}: DocumentCardProps) {
  return (
    <div
      className="bg-white shadow-sm rounded-xl p-2 border border-gray-200 flex items-center gap-3 hover:cursor-pointer hover:bg-gray-100"
      onClick={() => window.open(mediaURL, '_blank')}
    >
      <div className="bg-gray-100 p-2 rounded-sm">
        <File />
      </div>
      <div>
        <h4 className="text-gray-900 font-medium truncate w-48  lg:w-24 text-sm">
          {fileName}
        </h4>
        <p className="text-gray-500 text-xs">{date}</p>
      </div>
    </div>
  );
}

interface DocumentListProps {
  documents: DocumentCardProps[];
  loading?: boolean;
}

export function DocumentList({ documents, loading }: DocumentListProps) {
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 ">
      <h3 className="text-lg font-semibold text-gray-900">{t('DOCUMENTS')}</h3>
      <p className="text-gray-600 text-sm mb-4">
        {t('LIST_OF_ALL_THE_UPLOADED_DOCUMENTS')}
      </p>
      <div className="overflow-y-auto  scrollbar-hidden xl:h-[calc(100vh-540px)]  h-[calc(340px)] ">
        {loading && <SpinnerLoader />}
        {documents?.length ? (
          <div className="grid  grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {documents?.map((doc, index) => (
              <DocumentCard key={index} {...doc} />
            ))}
          </div>
        ) : (
          <NoResult message={t('NO_DOCUMENT_AVAILABLE')} />
        )}
      </div>
    </div>
  );
}
