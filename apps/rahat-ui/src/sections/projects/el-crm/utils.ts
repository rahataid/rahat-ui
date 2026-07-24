import { Stat } from '@rahat-ui/query';

export function getStat(stats: Stat[] | undefined, name: string): any {
  return stats?.find((s: Stat) => s.name === name)?.data;
}
