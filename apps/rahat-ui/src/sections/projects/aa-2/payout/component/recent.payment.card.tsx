import { Eye, ArrowLeftRight, Dot } from 'lucide-react';

interface GroupCardProps {
  beneficiaryGroupName: string;
  actions: string;
  merchentName: string;
  beneficiariesCount: number;
  dateTime: string;
  onView?: () => void;
}

export default function RecentPaymentCard({
  beneficiaryGroupName,
  actions,
  merchentName,
  beneficiariesCount,
  dateTime,
  onView,
}: GroupCardProps) {
  return (
    <div className="flex items-center justify-between p-1  bg-white">
      {/* Left Icon + Title + Description */}
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-full bg-muted">
          <ArrowLeftRight className="text-muted-foreground w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-sm text-foreground">
            {beneficiaryGroupName}
          </div>
          <div className=" flex text-sm text-muted-foreground">
            {actions}
            <Dot /> {merchentName}
          </div>
        </div>
      </div>
      {/* Beneficiaries Count */}
      <div className="text-sm text-muted-foreground">
        {beneficiariesCount} beneficiaries
      </div>
      {/* Date and Time */}
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        {dateTime}
      </div>
      {/* View Icon */}
      <button onClick={onView}>
        <Eye className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}
