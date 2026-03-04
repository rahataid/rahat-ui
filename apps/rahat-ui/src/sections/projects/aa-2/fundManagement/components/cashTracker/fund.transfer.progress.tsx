import StakeholderNode from './stackHolder.node';

function FundProgressTracker({
  balances,
  transfers,
}: {
  balances: {
    alias: string;
    balance: number;
    received: number;
    sent: number;
    date: Date;
  }[]; // balances by alias
  transfers: any;
}) {
  return (
    <div className="py-6">
      <div className="relative flex items-start w-full">
        {balances.length > 0 &&
          balances.map((balance, index) => {
            const isConfirmed =
              balance.alias !== 'Beneficiary'
                ? transfers?.find((t: any) => t.alias === balance.alias)
                    ?.received > 0
                : balance.received > 0;
            const isFirst = index === 0;
            const isLast = index === balances.length - 1;

            return (
              <div
                key={balance.alias}
                className="flex flex-col items-center relative flex-1"
              >
                {/* Node */}
                <div className="relative z-10 flex ">
                  <StakeholderNode
                    name={balance.alias}
                    status={isConfirmed ? 'confirmed' : 'pending'}
                    balance={balance.balance}
                    received={balance.received}
                    sent={balance.sent}
                    index={index}
                    isFirst={isFirst}
                    date={balance.date}
                  />
                </div>

                {/* Connecting line to the right (except for last node) */}
                {!isLast && (
                  <div
                    className={`absolute top-4 left-1/2 h-0.5 w-full ${
                      isConfirmed ? 'bg-green-500' : 'bg-gray-200'
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

export default FundProgressTracker;
