import { useState } from 'react';

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

export default function Step1DisburseMethod() {
  const [selectedMethod, setSelectedMethod] = useState(disburseMethods[0].id);

  return (
    <div className="bg-white rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div className="mb-6">
        <div className="flex flex-col space-y-4">
          {disburseMethods.map((method) => (
            <label key={method.id} className="inline-flex items-center mt-3">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-gray-600"
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
              />
              <span className="ml-2 text-gray-700">{method.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
