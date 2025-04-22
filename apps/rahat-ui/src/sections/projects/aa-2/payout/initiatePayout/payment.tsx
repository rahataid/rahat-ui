import { useParams } from 'next/navigation';

import { Back, Heading } from 'apps/rahat-ui/src/common';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useState } from 'react';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PaymentDialog } from './payment.dialog';

// export default function PaymentInitiation() {
//   const { id: projectID } = useParams();
//   const [method, setMethod] = useState<'FSP' | 'CVA'>('CVA');
//   const [offline, setOffline] = useState(false);
//   const [group, setGroup] = useState('');
//   const [vendor, setVendor] = useState('');

//   const handleSubmit = () => {
//     // onConfirm({ method, offline, group });
//   };
//   return (
//     <div className="p-4">
//       <div className="flex flex-col space-y-0">
//         <Back path={`/projects/aa/${projectID}/payout`} />
//         <div className="mt-4 flex justify-between items-center">
//           <Heading
//             title={`Payout`}
//             description="Select beneficiary group to initiate payment"
//           />
//         </div>
//         <div className="border rounded-sm p-6 space-y-6 bg-white w-full">
//           {/* Method Toggle */}
//           <RadioGroup
//             defaultValue={method}
//             onValueChange={(value) => setMethod(value as 'FSP' | 'CVA')}
//             className="flex items-center space-x-6"
//           >
//             <Label
//               htmlFor="method-cva"
//               className={`flex cursor-pointer items-center border p-3 w-28 justify-center rounded-sm space-x-2 ${
//                 method === 'CVA' ? 'border-blue-400' : ''
//               }`}
//             >
//               <RadioGroupItem value="CVA" id="method-cva" />
//               <span>CVA</span>
//             </Label>
//             <Label
//               htmlFor="method-fsp"
//               className={`flex cursor-pointer items-center border p-3 w-28 justify-center rounded-sm space-x-2 ${
//                 method === 'FSP' ? 'border-blue-400' : ''
//               }`}
//             >
//               <RadioGroupItem value="FSP" id="method-fsp" />
//               <span>FSP</span>
//             </Label>
//           </RadioGroup>
//           {/* Offline Toggle */}
//           <div className="flex items-center space-x-3">
//             <Switch
//               checked={offline}
//               onCheckedChange={setOffline}
//               id="offline-switch"
//             />
//             <Label htmlFor="offline-switch">
//               {offline ? 'Online' : 'Offline'}
//             </Label>
//           </div>

//           {/* Beneficiary Group Select */}
//           {offline && (
//             <SelectComponent
//               name="Vendor"
//               options={[
//                 'Rumsan Beneficiary Vendor',
//                 'Kathmandu Vendor',
//                 'Lalitpur Vendor',
//               ]}
//               value={vendor}
//               onChange={setVendor}
//             />
//           )}
//           <SelectComponent
//             name="Beneficiary Group"
//             options={[
//               'Rumsan Beneficiary Group',
//               'Kathmandu Group',
//               'Lalitpur Group',
//             ]}
//             value={group}
//             onChange={setGroup}
//           />

//           {/* Buttons */}
//           <div className="flex justify-end space-x-2 pt-4">
//             <Button variant="outline" onClick={() => {}} className="rounded-sm">
//               Cancel
//             </Button>
//             <PaymentDialog />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

type PaymentState = {
  method: 'FSP' | 'CVA';
  offline: boolean;
  group: string;
  vendor: string;
};

export default function PaymentInitiation() {
  const { id: projectID } = useParams();

  const [formState, setFormState] = useState<PaymentState>({
    method: 'CVA',
    offline: false,
    group: '',
    vendor: '',
  });

  const handleChange = <K extends keyof PaymentState>(
    key: K,
    value: PaymentState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const renderMethodOption = (value: 'FSP' | 'CVA') => (
    <Label
      htmlFor={`method-${value.toLowerCase()}`}
      className={`flex cursor-pointer items-center border p-3 w-28 justify-center rounded-sm space-x-2 ${
        formState.method === value ? 'border-blue-400' : ''
      }`}
    >
      <RadioGroupItem value={value} id={`method-${value.toLowerCase()}`} />
      <span>{value}</span>
    </Label>
  );

  const handleSubmit = () => {
    const data = {
      method: formState.method,
      group: formState.group,
      vendor: formState.vendor,
      token: '10',
      totalBeneficiaries: 20,
    };
    console.log(data);
  };
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectID}/payout`} />
        <div className="mt-4 flex justify-between items-center">
          <Heading
            title="Payout"
            description="Select beneficiary group to initiate payment"
          />
        </div>

        <div className="border rounded-sm p-6 space-y-6 bg-white w-full">
          {/* Payment Method */}
          <RadioGroup
            defaultValue={formState.method}
            onValueChange={(value) =>
              handleChange('method', value as 'FSP' | 'CVA')
            }
            className="flex items-center space-x-6"
          >
            {renderMethodOption('CVA')}
            {renderMethodOption('FSP')}
          </RadioGroup>

          {/* Online/Offline Toggle */}
          <div className="flex items-center space-x-3">
            <Switch
              checked={formState.offline}
              onCheckedChange={(checked) => handleChange('offline', checked)}
              id="offline-switch"
            />
            <Label htmlFor="offline-switch">
              {formState.offline ? 'Online' : 'Offline'}
            </Label>
          </div>

          {/* Vendor Select - only if offline */}
          {formState.offline && (
            <SelectComponent
              name="Vendor"
              options={[
                'Rumsan Beneficiary Vendor',
                'Kathmandu Vendor',
                'Lalitpur Vendor',
              ]}
              value={formState.vendor}
              onChange={(value) => handleChange('vendor', value)}
            />
          )}

          {/* Beneficiary Group Select */}
          <SelectComponent
            name="Beneficiary Group"
            options={[
              'Rumsan Beneficiary Group',
              'Kathmandu Group',
              'Lalitpur Group',
            ]}
            value={formState.group}
            onChange={(value) => handleChange('group', value)}
          />

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" className="rounded-sm">
              Cancel
            </Button>
            <PaymentDialog
              formState={formState}
              handleSubmit={handleSubmit}
              token={'100'}
              totalBeneficiaries={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
