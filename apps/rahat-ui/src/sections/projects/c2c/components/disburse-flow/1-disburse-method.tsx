import { TREASURY_SOURCES } from '@rahat-ui/query';
import { Coins, Wallet, KeyRound } from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  PROJECT: Coins,
  EOA: Wallet,
  MULTISIG: KeyRound,
};

type Step1DisburseMethodProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projectSubgraphDetails: any;
  treasurySources: string[];
};

export default function Step1DisburseMethod({
  onChange,
  value,
  projectSubgraphDetails,
  treasurySources,
}: Step1DisburseMethodProps) {
  const filteredTreasurySources = TREASURY_SOURCES?.filter((source) =>
    treasurySources?.includes(source?.value),
  );

  return (
    <>
      <div className="m-4 p-6">
        <div className="flex flex-col mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">
            Select Disbursement Method
          </h1>
          <p className="text-gray-500 font-normal text-base">
            How would you like to disburse the fund?
          </p>
        </div>
        <div className="flex gap-5 bg-zinc-50">
          {filteredTreasurySources?.map((method) => {
            const IconComponent = iconMap[method.value];

            return (
              <label
                key={method.value}
                className="flex items-center p-4 border rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow w-full"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  {IconComponent && <IconComponent className="text-blue-600" />}
                </div>
                <div className="ml-4 flex-1">
                  <span className="text-gray-900 font-medium">
                    {method.label}
                  </span>
                  <span className="ml-2 text-gray-400">
                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                  </span>
                </div>
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  checked={value === method.value}
                  onChange={() =>
                    onChange({
                      target: { name: 'treasurySource', value: method.value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
}
