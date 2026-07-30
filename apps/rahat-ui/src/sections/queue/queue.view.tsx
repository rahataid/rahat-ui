import React from 'react';
import QueueList from './queue-list';
import { useTranslations } from 'next-intl';

const QueueMainView: React.FC = () => {
  const t = useTranslations('QUEUES');
  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{t('QUEUE_MANAGEMENT')}</h1>
      <QueueList />
    </div>
  );
};

export default QueueMainView;
