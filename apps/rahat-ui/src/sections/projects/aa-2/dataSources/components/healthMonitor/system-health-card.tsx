import { HealthCacheData } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/src/components/ui/hover-card';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { CheckCircle, Info, X } from 'lucide-react';
import { getDynamicColors } from './utils/getDynamicColor';

export function SystemHealthCard({
  overall_status,
  last_updated,
  sources,
}: HealthCacheData) {
  const statusColors: any = {
    HEALTHY: 'bg-green-50 text-green-700',
    UNHEALTHY: 'bg-red-50 text-red-700',
    DEGRADED: 'bg-yellow-50 text-yellow-700',
  };

  const calcHEALTHY = sources?.filter(
    (s) => s.currentStatus === 'HEALTHY',
  ).length;
  const calcUNHEALTHY = sources?.filter(
    (s) => s.currentStatus === 'UNHEALTHY',
  ).length;
  const calcDEGRADED = sources?.filter(
    (s) => s.currentStatus === 'DEGRADED',
  ).length;

  return (
    <Card
      className={`border ${getDynamicColors(
        overall_status,
      )} shadow-sm rounded-sm mb-1`}
    >
      <CardContent className="flex flex-col space-y-3 p-4">
        <div className="flex flex-col w-full p-3 pt-0 gap-2">
          <div className="flex flex-row items-center gap-3">
            <span className="text-sm font-medium">Overall system health:</span>

            <Badge variant="outline" className={statusColors[overall_status]}>
              {overall_status}
            </Badge>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="h-3.5 w-3.5 text-gray-500 hover:cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent
                className="w-auto rounded-sm p-3 max-w-md mx-auto bg-white shadow  space-y-6 border"
                align="start"
              >
                <div className="flex gap-2 flex-col">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Overall Status Rules
                    </h4>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <span className=" text-green-600">HEALTHY:</span> All
                        sources are UP
                      </li>
                      <li>
                        <span className=" text-yellow-600">DEGRADED:</span> Some
                        sources are DOWN/DEGRADED but core functionality
                        available
                      </li>
                      <li>
                        <span className=" text-red-600">UNHEALTHY:</span>
                        Critical sources are DOWN
                      </li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-1">Validity Rules</h4>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <span className=" text-green-600">VALID:</span> Data
                        updated within expected interval (&lt;=15 mins)
                      </li>
                      <li>
                        <span className=" text-yellow-600">STALE:</span> Data
                        are older than expected but within tolerance (15–30
                        mins)
                      </li>
                      <li>
                        <span className=" text-red-600">EXPIRED:</span> Data too
                        old to be reliable (&gt;30 mins)
                      </li>
                    </ul>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row gap-3">
              <span className="flex items-center  text-xs text-green-500">
                {' '}
                <CheckCircle size={13} className="pr-1 w-4 h-4" />
                {calcHEALTHY}/{sources?.length} sources HEALTHY
              </span>
              <span className="flex items-center  text-xs text-red-500">
                <X size={13} className="pr-1 w-4 h-4" />
                {calcUNHEALTHY} sources UNHEALTHY
              </span>

              <span className="flex items-center  text-xs text-red-500">
                <X size={13} className="pr-1 w-4 h-4" />
                {calcDEGRADED} sources DEGRADED
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
