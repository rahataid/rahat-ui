import { ReactNode } from 'react';

type IProps = {
  icon: ReactNode;
  title: string;
  content: string;
};

export default function DetailsHeadCard({ icon, title, content }: IProps) {
  return (
    <div className="p-4 rounded bg-card flex items-center gap-4 w-full">
      <div className="p-3 bg-secondary text-primary rounded">{icon}</div>
      <div>
        <h1 className="font-medium">{title}</h1>
        <p className="text-xl text-primary font-semibold">{content}</p>
      </div>
    </div>
  );
}
