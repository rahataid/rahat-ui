import * as React from 'react';
import { useParams, useRouter } from "next/navigation";
import { useSingleStakeholdersGroup, useDeleteStakeholdersGroups } from "@rahat-ui/query";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import StakeholdersTable from "../../../stakeholders/stakeholders.table";
import useDetailsStakeholdersTableColumn from "./table/useDetailsStakeholdersTableColumns";
import ClientSidePagination from "../../../../components/client.side.pagination";
import EditButton from "../../../../components/edit.btn";
import DeleteButton from "../../../../components/delete.btn";
import Back from "../../../../components/back";
import { UUID } from "crypto";
import Loader from 'apps/rahat-ui/src/components/table.loader';

export default function StakeholdersGroupDetailView() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as UUID;
    const groupId = params.groupId as UUID;

    const { data: groupDetails, isLoading } = useSingleStakeholdersGroup(projectId, groupId);

    const deleteStakeholdersGroup = useDeleteStakeholdersGroups();

    const groupPath = `/projects/aa/${projectId}/groups`;
    const editPath = `/projects/aa/${projectId}/groups/stakeholders/${groupId}/edit`;

    const columns = useDetailsStakeholdersTableColumn();

    const table = useReactTable({
        data: groupDetails?.stakeholders ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleDelete = () => {
        deleteStakeholdersGroup.mutateAsync({
            projectUUID: projectId,
            stakeholdersGroupPayload: { uuid: groupId },
        });
    }

    React.useEffect(() => {
        deleteStakeholdersGroup.isSuccess && router.push(groupPath);
    }, [deleteStakeholdersGroup.isSuccess]);

    return (
        <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
            {isLoading ? <Loader /> : (
                <>
                    <div className="flex justify-between mb-2">
                        <div className=" flex gap-4 items-center">
                            <Back path={groupPath} />
                            <h1 className="text-2xl font-semibold">{groupDetails?.name}</h1>
                        </div>
                        <div className="flex gap-4 items-center">
                            <EditButton path={editPath} />
                            <DeleteButton name="Stakeholders Group" handleContinueClick={handleDelete} />
                        </div>
                    </div>
                    <div className="bg-card border rounded">
                        <StakeholdersTable table={table} tableScrollAreaHeight="h-[calc(100vh-186px)]" />
                        <ClientSidePagination table={table} />
                    </div>
                </>
            )}

        </div>
    )
}