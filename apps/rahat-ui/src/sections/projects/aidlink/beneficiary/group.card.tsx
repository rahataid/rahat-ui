import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { UUID } from 'crypto';
import { Calendar, Edit, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

type GroupProps = {
  group: any;
  projectUUID: UUID;
};

export default function GroupCard({ group, projectUUID }: GroupProps) {
  return (
    <Card
      key={group.id}
      className="border rounded-sm hover:shadow-md transition-shadow"
    >
      <CardHeader className="pb-0">
        <h4 className="font-semibold text-gray-900">{group.name}</h4>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Beneficiaries</p>
            <p className="font-semibold text-lg">
              {group._count.groupedBeneficiaries}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Disbursed</p>
            <p className="font-semibold text-lg">N/A</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3" />
            <span>Updated: {dateFormat(group.updatedAt)}</span>
          </div>
          {/* {group.lastDisbursement && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>Last disbursement: {group.lastDisbursement}</span>
            </div>
          )} */}
        </div>

        <div className="flex gap-2">
          <Link
            className="flex-1 bg-transparent"
            href={`/projects/aidlink/${projectUUID}/beneficiary/groups/${group.uuid}`}
          >
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
