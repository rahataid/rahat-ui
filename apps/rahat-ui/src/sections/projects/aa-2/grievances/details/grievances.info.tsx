import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { formatDateFull } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  Calendar,
  Clock,
  Flag,
  Hash,
  Info,
  Settings2,
  TriangleAlert,
  User,
} from 'lucide-react';
import { PriorityChip, StatusChip, TypeChip } from '../components';

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
  return (
    <div className="flex flex-col gap-[16px] w-full">
      {/* Overview Cards Row */}
      <div className="flex flex-row gap-[16px]">
        {/* Grievance ID Card */}
        <Card className="border border-gray-200 bg-white border rounded-xl w-[25%]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 border rounded-[8px]">
                <Hash className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-inter font-medium text-[14px] leading-[24px] tracking-normal text-[#667085] uppercase tracking-wide">
                  Grievance ID
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {grievance?.id || grievance?.uuid?.slice(0, 8) || '1234'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grievance Type Card */}
        <Card className="border border-gray-200 bg-white border rounded-xl w-[25%]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 border rounded-[8px]">
                <Settings2 className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-inter font-medium text-[14px] leading-[24px] tracking-normal text-[#667085] uppercase tracking-wide">
                  Grievance Type
                </p>
                <div className="mt-1">
                  <TypeChip type={grievance?.type} showIcon={false} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Card */}
        <Card className="border border-gray-200 bg-white border rounded-xl w-[25%]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 border rounded-[8px] bg-[#FAEFE5]">
                <Flag className="w-4 h-4 text-[#D66629]" />
              </div>
              <div>
                <p className="font-inter font-medium text-[14px] leading-[24px] tracking-normal text-[#667085] uppercase tracking-wide">
                  Priority
                </p>
                <div className="mt-1">
                  <PriorityChip
                    priority={grievance?.priority}
                    showIcon={false}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="border border-gray-200 bg-white border rounded-xl w-[25%]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 border rounded-[8px] bg-[#E5F2FF]">
                <Info className="w-4 h-4 text-[#297AD6]" />
              </div>
              <div>
                <p className="font-inter font-medium text-[14px] leading-[24px] tracking-normal text-[#667085] uppercase tracking-wide">
                  Status
                </p>
                <div className="mt-1">
                  <StatusChip status={grievance?.status} showIcon={false} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grievance Details Section */}
      <Card className="border border-gray-200 bg-white border rounded-xl">
        <CardHeader className="pb-1">
          <CardTitle className="flex">
            <span className="mr-2">
              <TriangleAlert className="w-4 h-4 text-[#434956]" />
            </span>
            <div className="flex items-center h-full font-inter font-medium text-[14px] leading-4 tracking-[0.03em] uppercase text-[#434956] text-center">
              GRIEVANCE DETAILS
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-[12px] p-[16px]">
          <div className="border rounded-[8px] bg-[#FAFAFA] p-[12px] gap-[12px] flex flex-col">
            <div>
              <label className="font-inter font-normal text-[14px] leading-[16px] tracking-normal text-[#505868]">
                Grievance Title
              </label>
              <div className="font-inter font-medium text-[14px] leading-[24px] tracking-normal text-[#3D3D51]">
                {grievance?.title || 'Grievance Title Goes Here'}
              </div>
            </div>
            <div>
              <label className="font-inter font-normal text-[14px] leading-[16px] tracking-normal text-[#505868]">
                Description
              </label>
              <p className="font-inter font-medium text-[14px] leading-[24px] tracking-normal text-[#3D3D51]">
                {grievance?.description || 'Grievance description goes here'}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Tags
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {grievance?.tags && grievance.tags.length > 0 ? (
                grievance.tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 border-gray-200"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500 italic">
                  No tags assigned
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-row w-full gap-[16px] rounded-xl">
        {/* Reporter Information Section */}
        <div className="flex flex-col gap-[12px] w-[50%]   p-4 gap-2 rounded-[12px] border border-[#F0F1F3] bg-white shadow-[0px_1px_2px_0px_#0000000F] opacity-100">
          <div className="flex">
            <div className="flex mr-2">
              <User className="w-4 h-4 text-[#434956]" />
            </div>
            <div className="flex items-center h-full font-inter font-medium text-[14px] leading-4 tracking-[0.03em] uppercase text-[#434956]">
              REPORTER INFORMATION
            </div>
          </div>
          <div className="flex gap-[16px]">
            <div className="flex flex-col w-[50%] px-3 py-2 gap-1 rounded-[12px] opacity-100 bg-[#FAFAFA]">
              <div className="font-inter font-normal text-[14px] leading-[24px] tracking-[0em] text-[#3D3D51]">
                Reported By
              </div>
              <div className="font-inter font-medium text-[14px] leading-[16px] tracking-[0em] text-[#505868]">
                {grievance?.createdByUser?.name || 'N/A'}
              </div>
            </div>
            <div className="flex flex-col w-[50%] px-3 py-2 gap-1 rounded-[12px] opacity-100 bg-[#FAFAFA]">
              <div className="font-inter font-normal text-[14px] leading-[24px] tracking-[0em] text-[#3D3D51]">
                Reporter&apos;s Contact
              </div>
              <div className="font-inter font-medium text-[14px] leading-[16px] tracking-[0em] text-[#505868]">
                {grievance?.reporterContact || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="flex flex-col gap-[12px] w-[50%] p-4 gap-2 rounded-[12px] border border-[#F0F1F3] bg-white shadow-[0px_1px_2px_0px_#0000000F] opacity-100">
          <div className="flex">
            <div className="mr-2">
              <Clock className="w-4 h-4 text-[#434956]" />
            </div>
            <div className="flex items-center h-full font-inter font-medium text-[14px] leading-4 tracking-[0.03em] uppercase text-[#434956]">
              Timeline
            </div>
          </div>

          <div className="flex gap-[16px]">
            <div className="flex w-[50%] px-3 py-2 gap-4 rounded-[8px] opacity-100 bg-[#FAFAFA]">
              <div className="flex items-center justify-center h-[100%]">
                <Calendar className="w-6 h-6 text-[#434956]" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="font-inter font-normal text-[14px] leading-[24px] tracking-[0em] text-[#3D3D51]">
                  Created at
                </div>
                <div className="font-inter font-medium text-[14px] leading-[16px] tracking-[0em] text-[#505868]">
                  {grievance?.createdAt
                    ? formatDateFull(grievance?.createdAt)
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex w-[50%] px-3 py-2 gap-4 rounded-[8px] opacity-100 bg-[#FAFAFA]">
              <div className="flex items-center justify-center h-[100%]">
                <Calendar className="w-6 h-6 text-[#434956]" />
              </div>
              <div className="flex flex-col gap-[4px]">
                <div className="font-inter font-normal text-[14px] leading-[24px] tracking-[0em] text-[#3D3D51">
                  Updated at
                </div>
                <div className="font-inter font-medium text-[14px] leading-[16px] tracking-[0em] text-[#505868]">
                  {grievance?.updatedAt
                    ? formatDateFull(grievance?.updatedAt)
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceInfo;
