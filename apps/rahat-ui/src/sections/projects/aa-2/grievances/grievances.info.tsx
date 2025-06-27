import { StatusChip, PriorityChip, TypeChip } from './components';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import {
  Calendar,
  User,
  Tag,
  AlertCircle,
  FileText,
  Clock,
  Flag,
} from 'lucide-react';

// Mock format date function since we don't have the actual utility
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type IProps = {
  grievance: any;
};

const GrievanceInfo = ({ grievance }: IProps) => {
  console.log('grievance details', grievance);



  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Status
                </p>
                <div className="mt-1">
                  <StatusChip status={grievance?.status} showIcon={false} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Flag className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Priority
                </p>
                <div className="mt-1">
                  <PriorityChip priority={grievance?.priority} showIcon={false} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Title
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {grievance?.title || 'N/A'}
              </p>
            </div>

            <Separator />

            <div>
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Reported By
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {grievance?.reportedBy || grievance?.reporter || 'N/A'}
              </p>
            </div>

            <Separator />

            <div>
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Type
              </label>
              <div className="mt-1">
                <TypeChip type={grievance?.type} showIcon={false} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-600" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(grievance?.createdAt || grievance?.createdOn)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {grievance?.description && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center">
              <FileText className="w-4 h-4 mr-2 text-gray-600" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-gray-300">
              <p className="text-sm text-gray-700 leading-relaxed">
                {grievance.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {(grievance?.createdBy || grievance?.assignedTo) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {grievance?.createdBy && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600">
                  Created By
                </span>
                <span className="text-sm text-gray-900">
                  {grievance.createdBy}
                </span>
              </div>
            )}
            {grievance?.assignedTo && (
              <>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">
                    Assigned To
                  </span>
                  <span className="text-sm text-gray-900">
                    {grievance.assignedTo}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GrievanceInfo;
