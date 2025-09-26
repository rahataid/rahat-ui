import InKindStakeholderNode from './in.kind.stakeholder.node';

function InKindProgressTracker({
  balances,
  transfers,
}: {
  balances: { alias: string; balance: number; received: number }[];
  transfers: any;
}) {
  return (
    <div className="py-6">
      <div className="relative flex items-start w-full">
        {balances.length > 0 &&
          balances.map((balance, index) => {
            const isConfirmed = balance.received > 0;
            const isFirst = index === 0;
            const isLast = index === balances.length - 1;

            return (
              <div
                key={balance.alias}
                className="flex flex-col items-center relative flex-1"
              >
                {/* Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <InKindStakeholderNode
                    name={balance.alias}
                    status={isConfirmed ? 'confirmed' : 'pending'}
                    balance={balance.balance}
                    received={balance.received}
                    index={index}
                    isFirst={isFirst}
                  />
                </div>

                {/* Connecting line to the right (except for last node) */}
                {!isLast && (
                  <div
                    className={`absolute top-4 left-1/2 h-0.5 w-full ${
                      isConfirmed || isFirst ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{
                      zIndex: 1,
                    }}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default InKindProgressTracker;
