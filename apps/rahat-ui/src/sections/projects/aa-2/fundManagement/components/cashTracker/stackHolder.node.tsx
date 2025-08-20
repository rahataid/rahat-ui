import { AlertCircle, Check, Info } from 'lucide-react';

function StakeholderNode({
  name,
  status,
  balance,
  received,
  index,
}: {
  name: string;
  status: string;
  balance: number;
  received: number;
  index?: number;
}) {
  return (
    <div className="flex flex-col items-center ">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
        ${
          status === 'confirmed' || index === 0
            ? 'bg-green-500 text-white'
            : status === 'pending'
            ? 'bg-amber-500 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        {status === 'confirmed' || index === 0 ? (
          <Check size={16} />
        ) : status === 'pending' ? (
          <Info size={16} />
        ) : (
          <AlertCircle size={16} />
        )}
      </div>
      <div className="mt-3 text-center">
        <p className="font-medium text-sm">{name}</p>
        <div className="mt-1 flex justify-center text-xs text-gray-500">
          <p>Received:</p>
          <p className="font-medium">${received.toLocaleString()}</p>
        </div>
        <div className="mt-1 flex justify-center text-xs text-gray-500">
          <p>Balance:</p>
          <p className="font-medium">${balance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
export default StakeholderNode;
