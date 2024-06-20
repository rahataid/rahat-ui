import { useParams } from 'next/navigation';
import { useAATriggerStatements, usePagination } from '@rahat-ui/query';
import TriggerPhaseCards from './trigger.phase.cards';
import TriggerStatementsList from './trigger.statements.list';
import { UUID } from 'crypto';
import SearchInput from '../../components/search.input';
import React from 'react';

export default function TriggerStatementsListView() {
  const { id } = useParams();
  const projectId = id as UUID;

  const handleSearch = () => { };
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      <TriggerPhaseCards projectId={projectId} />
      <SearchInput
        name="Trigger Statement"
        className="mb-2"
        onSearch={handleSearch}
        isDisabled={true}
      />
      <TriggerStatementsList />
    </div>
  );
}
