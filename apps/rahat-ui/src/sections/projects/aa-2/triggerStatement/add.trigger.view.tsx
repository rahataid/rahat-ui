import { Back, Heading } from 'apps/rahat-ui/src/common';
import { TriggerTypeTabs } from './components';

export default function AddTriggerView() {
  return (
    <div className="p-4">
      <Back path="" />
      <Heading
        title="Add Trigger"
        description="Fill the form below to create new trigger statement"
      />
      <div className="border p-4 rounded-md shadow">
        <Heading
          title="Select Trigger Type"
          titleStyle="text-xl/6 font-semibold"
          description="Select trigger type and fill the details below"
        />
        <TriggerTypeTabs />
      </div>
    </div>
  );
}
