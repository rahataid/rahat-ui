import React from 'react';
import QueueList from './queue-list';

const QueueMainView: React.FC = () => {
  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Queue Management</h1>
      <QueueList />
    </div>
  );
};

export default QueueMainView;
