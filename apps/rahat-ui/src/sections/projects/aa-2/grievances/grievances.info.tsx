import { formatDate } from 'apps/community-tool-ui/src/utils';
import { DataItem } from 'apps/rahat-ui/src/common';

type IProps = {
  grievance: any;
};

const GrievanceInfo = ({ grievance }: IProps) => {
  console.log('grievance details', grievance);
  return (
    <>
      <div className="grid grid-cols-3 gap-6 px-6 py-4">
        <DataItem label="Title" value={grievance?.title || 'N/A'} />
        <DataItem label="Reported By" value={grievance?.reportedBy || 'N/A'} />
        <DataItem label="Type" value={grievance?.type || 'N/A'} />
        <DataItem label="Status" value={grievance?.status || 'N/A'} isBadge />
        <DataItem
          label="Priority"
          value={grievance?.priority || 'N/A'}
          isBadge
        />
        <DataItem label="Created At" value={formatDate(grievance?.createdAt)} />
        <DataItem label="Description" value={grievance?.description || 'N/A'} />
      </div>
    </>
  );
};

export default GrievanceInfo;
