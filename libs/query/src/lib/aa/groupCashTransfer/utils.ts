'use client';
import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
import { useSwal } from 'libs/query/src/swal';

export const ACTION_NS = 'aaProject.groupCashTransfer';

export async function runAction(
  q: ReturnType<typeof useProjectAction>,
  projectUUID: UUID,
  action: string,
  payload: Record<string, unknown>,
) {
  return q.mutateAsync({
    uuid: projectUUID as `${string}-${string}-${string}-${string}-${string}`,
    data: { action, payload },
  });
}

export function useToast() {
  const alert = useSwal();
  return alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
}
