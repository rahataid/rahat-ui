import { HealthCacheData } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function SystemHealthCard({
  overall_status,
  last_updated,
  sources,
}: HealthCacheData) {
  const statusColors: any = {
    UP: 'bg-green-100 text-green-700',
    DOWN: 'bg-red-100 text-red-700',
    DEGRADED: 'bg-yellow-100 text-yellow-700',
  };

  const getBgColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'text-green-500 bg-green-100 border-green-500';
      case 'UNHEALTHY':
        return 'text-red-500 bg-red-100 border-red-500';
      case 'DEGRADED':
        return 'text-yellow-500 bg-yellow-100 border-yellow-500';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const calcUP = sources?.filter((s) => s.status === 'UP').length;
  const calcDOWN = sources?.filter((s) => s.status === 'DOWN').length;

  console.log(calcUP, calcDOWN);
  return (
    <Card
      className={`border ${getBgColor(
        overall_status,
      )} shadow-sm rounded-sm mb-2`}
    >
      <CardContent className="flex flex-col space-y-3 p-4">
        <div className="flex flex-col w-full p-3 pt-0 gap-2">
          <div className="flex flex-row items-center gap-3">
            <span className="text-sm font-medium">Overall system health:</span>

            <Badge variant="outline" className={statusColors[overall_status]}>
              {overall_status}
            </Badge>
            <Info className="h-3.5 w-3.5 text-gray-500" />
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row gap-3">
              <span className="flex items-center  text-xs text-green-500">
                {' '}
                <CheckCircle size={13} className="pr-1 w-4 h-4" />
                {calcUP}/{sources?.length}sources UP
              </span>
              <span className="flex items-center  text-xs text-red-500">
                <X size={13} className="pr-1 w-4 h-4" />
                {calcDOWN} sources DOWN
              </span>
            </div>

            <span className="text-xs text-gray-500 ml-auto">
              Last Updated: {dateFormat(last_updated)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
