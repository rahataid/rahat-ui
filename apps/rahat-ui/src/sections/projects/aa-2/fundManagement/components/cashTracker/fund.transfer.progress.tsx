import StakeholderNode from './stackHolder.node';

function FundProgressTracker({
  balances,
  transfers,
}: {
  balances: { alias: string; balance: number; received: number }[]; // balances by alias
  transfers: any;
}) {
  return (
    <div className="py-4">
      <div className="relative flex items-center w-full">
        {balances.length > 0 &&
          balances.map((balance, index) => {
            const isConfirmed =
              transfers?.find((t: any) => t.alias === balance.alias)?.received >
              0;

            return (
              <div key={balance.alias} className="flex-1 relative flex">
                {/* Left connecting line (except for last node) */}
                {index < balances.length - 1 && (
                  <div
                    className={`absolute top-4  left-16 h-1 ${
                      transfers?.find((t: any) => t.alias === balance?.alias)
                        ?.received > 0 || index === 0
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                    style={{
                      width: '100%',
                    }}
                  />
                )}

                {/* Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <StakeholderNode
                    name={balance.alias}
                    status={isConfirmed ? 'confirmed' : 'pending'}
                    balance={balance.balance}
                    received={balance.received}
                    index={index}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default FundProgressTracker;
