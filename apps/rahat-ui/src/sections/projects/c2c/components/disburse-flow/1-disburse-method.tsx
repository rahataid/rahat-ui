const disburseMethods = [
  {
    id: 'project_balance',
    label: 'Project Balance',
  },
  {
    id: 'your_wallet',
    label: 'Your Wallet',
  },
  {
    id: 'multisig_wallet',
    label: 'Multisig Wallet A/C',
  },
];

type Step1DisburseMethodProps = {
  selectedBeneficiaries: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Step1DisburseMethod({
  onChange,
  selectedBeneficiaries,
  value,
}: Step1DisburseMethodProps) {
  return (
    <div className="bg-card rounded px-4 pb-4 flex flex-col">
      <div className="mb-2">
        <div className="flex flex-col">
          {disburseMethods.map((method) => (
            <label key={method.id} className="inline-flex items-center mt-3">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-gray-600"
                checked={value === method.id}
                onChange={() =>
                  onChange({
                    target: { name: 'depositMethod', value: method.id },
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
