import { useParams } from 'next/navigation';
import { useAATriggerStatements } from '@rahat-ui/query';
import TriggerPhaseCards from './trigger.phase.cards';
import TriggerStatementsList from './trigger.statements.list';
import { UUID } from 'crypto';
import SearchInput from '../../components/search.input';

export default function TriggerStatementsListView() {
    const { id } = useParams()
    const projectId = id as UUID
    const { data: tableData, isLoading } = useAATriggerStatements(projectId);

    const handleSearch = () => { }
    return (
        <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
            <TriggerPhaseCards projectId={projectId} />
            <SearchInput className='mb-2' onSearch={handleSearch} />
            <TriggerStatementsList tableScrollAreaHeight="h-[calc(100vh-336px)]" isLoading={isLoading} tableData={tableData} />
        </div>
    )
}