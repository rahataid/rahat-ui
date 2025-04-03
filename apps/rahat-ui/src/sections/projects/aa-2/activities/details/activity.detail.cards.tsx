'use client';
import * as React from 'react';

// import UpdateActivityStatusDialog from './update.activity.status.dialog';

// export default function ActivityDetailCards({
//   activityDetail,
//   loading,
// }: IProps) {
//   return (
//     <div className="grid grid-cols-4 gap-4 mt-4">
//       <div className="p-4 rounded bg-card flex items-center gap-4">
//         <div className="p-3 bg-secondary text-primary rounded">
//           <Info size={25} />
//         </div>
//         <div className="w-full">
//           <div className="flex justify-between items-center">
//             <h1 className="font-medium">Status</h1>
//             <UpdateActivityStatusDialog
//               activityDetail={activityDetail}
//               loading={loading}
//               triggerTitle="update"
//               iconStyle="mr-1 h-3 w-3"
//             />
//           </div>
//           <Badge className={`${getStatusBg(activityDetail?.status)}`}>
//             {activityDetail?.status}
//           </Badge>
//         </div>
//       </div>
//       <div className="p-4 rounded bg-card flex items-center gap-4">
//         <div className="p-3 bg-secondary text-primary rounded">
//           <Text size={25} />
//         </div>
//         <div>
//           <h1 className="font-medium">Responsible Station</h1>
//           <p className="text-xl text-primary font-semibold">
//             {activityDetail?.source}
//           </p>
//         </div>
//       </div>
//       <div className="p-4 rounded bg-card flex items-center gap-4">
//         <div className="p-3 bg-secondary text-primary rounded">
//           <SignalHigh size={25} />
//         </div>
//         <div>
//           <h1 className="font-medium">Phase</h1>
//           <p className="text-xl text-primary font-semibold">
//             {activityDetail?.phase?.name}
//           </p>
//         </div>
//       </div>
//       <div className="p-4 rounded bg-card flex items-center gap-4">
//         <div className="p-3 bg-secondary text-primary rounded">
//           <Book size={25} />
//         </div>
//         <div>
//           <h1 className="font-medium">Activity Type</h1>
//           <p className="text-xl text-primary font-semibold">
//             {activityDetail?.isAutomated ? 'Automated' : 'Manual'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

type ActivityDetailCardsProps = {
  activityDetail?: any;
  loading?: boolean;
};

export default function ActivityDetailCards({
  activityDetail,
  loading,
}: ActivityDetailCardsProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-200">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-md">
          Preparedness
        </span>
        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-md">
          Manual
        </span>
        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-md">
          Category Name Demo
        </span>
        <span className="ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-md">
          Not Started
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        Distribute educational materials about the anticipatory action plan to
        local communities
      </h3>
      <p className="text-gray-600 text-sm mt-1">
        Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
        libero
      </p>
      <div className="text-gray-500 text-sm mt-3 flex flex-wrap gap-2">
        <span>Karnali</span>
        <span>&bull;</span>
        <span>Lead Time demo</span>
      </div>
      <div className="flex items-center text-gray-500 text-sm mt-2">
        <span className="mr-2">👤</span>
        <span>Assigned to: Sharmila Shrestha</span>
      </div>
    </div>
  );
}
