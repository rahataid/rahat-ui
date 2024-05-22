import DocumentCard from '../../../components/document.card';

type IDocument = {
  mediaUTL: string;
  fileName: string;
};

type IProps = {
  documents: IDocument[];
};

function renderDocs(documents: IDocument[]) {
  return documents?.map((d: any, index: number) => (
    <DocumentCard key={index} name={d.fileName} path={d.mediaURL} />
  ));
}

export default function ManualTriggerDocumentsCard({ documents }: IProps) {
  return (
    <div className="bg-card p-4 rounded">
      <h1 className="font-semibold text-lg">Documents</h1>
      <div className="grid gap-2 mt-2">
        {documents?.length ? renderDocs(documents) : 'Documents not available.'}
      </div>
    </div>
  );
}
