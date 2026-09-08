import { useParams } from 'next/navigation';
import TriggerPhaseCards from './trigger.phase.cards';
import TriggerStatementsList from './trigger.statements.list';
import { UUID } from 'crypto';
import SearchInput from '../../components/search.input';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function TriggerStatementsListView() {
  const tGlobal = useTranslations('GLOBAL');
  const { id } = useParams();
  const projectId = id as UUID;

  const handleSearch = () => {};
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      <TriggerPhaseCards projectId={projectId} />
      <SearchInput
        name={tGlobal('TRIGGER_STATEMENT')}
        className="mb-2"
        onSearch={handleSearch}
        isDisabled={true}
      />
      <TriggerStatementsList />
    </div>
  );
}
