import { TREASURY_SOURCES } from '@rahat-ui/query';

type Step1DisburseMethodProps = {
  selectedBeneficiaries: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projectSubgraphDetails: any;
  treasurySources: string[];
};

export default function Step1DisburseMethod({
  onChange,
  selectedBeneficiaries,
  value,
  projectSubgraphDetails,
  treasurySources,
}: Step1DisburseMethodProps) {
  console.log({ treasurySources });
  return (
    <div className="bg-card rounded px-4 pb-4 flex flex-col">
      <div className="mb-2">
        <div className="flex flex-col">
          {TREASURY_SOURCES.map((method) => (
            <label key={method.value} className="inline-flex items-center mt-3">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-gray-600"
                checked={value === method.value}
                onChange={() =>
                  onChange({
                    target: { name: 'treasurySource', value: method.value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
              <span className="ml-2 text-gray-700">{method.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
