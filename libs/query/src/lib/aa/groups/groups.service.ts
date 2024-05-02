import { useEffect } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useStakeholdersGroupsStore } from './groups.store';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';

export const useCreateStakeholdersGroups = () => {
    const q = useProjectAction();
    const alert = useSwal();
    const toast = alert.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });
    return useMutation({
        mutationFn: async ({
            projectUUID,
            stakeholdersGroupPayload,
        }: {
            projectUUID: UUID;
            stakeholdersGroupPayload: {
                name: string;
                stakeholders: Array<{
                    uuid: string
                }>
            };
        }) => {
            return q.mutateAsync({
                uuid: projectUUID,
                data: {
                    action: 'aaProject.stakeholders.addGroup',
                    payload: stakeholdersGroupPayload,
                }
            })
        },
        onSuccess: () => {
            q.reset();
            toast.fire({
                title: 'Stakeholders Group added successfully',
                icon: 'success',
            });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error';
            q.reset();
            toast.fire({
                title: 'Error while adding stakeholders group.',
                icon: 'error',
                text: errorMessage,
            });
        },
    })
}