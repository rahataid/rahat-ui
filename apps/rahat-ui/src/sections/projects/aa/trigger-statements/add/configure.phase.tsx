import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { Slider } from '@rahat-ui/shadcn/src/components/ui/slider';
import { Minus, Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

// const MandatoryTriggers = [
//   { title: 'Trigger 1', isOptional: false },
//   { title: 'Trigger 2', isOptional: false },
// ];
const OptionalTriggers = [
  { title: 'Trigger 3', isOptional: true },
  { title: 'Trigger 4', isOptional: true },
];

type IProps = {
  manualForm: UseFormReturn<
    {
      title: string;
      hazardTypeId: string;
    },
    any,
    undefined
  >;
  automatedForm: UseFormReturn<
    {
      title: string;
      hazardTypeId: string;
      dataSource: string;
      location: string;
      readinessLevel?: string | undefined;
      activationLevel?: string | undefined;
    },
    any,
    undefined
  >;
  phaseDetail: any;
  activeTab: string;
};

export default function ConfigurePhase({
  phaseDetail,
  manualForm,
  automatedForm,
  activeTab,
}: IProps) {
  const mandatoryTriggers = phaseDetail?.triggers?.filter(
    (d: any) => d?.isMandatory,
  );
  const optionalTriggers = phaseDetail?.triggers?.filter(
    (d: any) => !d?.isMandatory,
  );

  console.log(mandatoryTriggers);
  console.log(optionalTriggers);
  const formValues = manualForm.getValues();
  console.log(formValues);
  console.log(activeTab);

  const [newTriggerData, setNewTriggerData] = React.useState<any>({});

  const [sliderValue, setSliderValue] = React.useState(0);

  React.useEffect(() => {
    console.log('effect');

    if (activeTab === 'manualTrigger') {
      console.log('effect1');

      const formValues = manualForm.getValues();
      // setNewTriggerData(formValues);
      console.log(formValues);
    }

    if (activeTab === 'automatedTrigger') {
      console.log('effect2');

      const formValues = automatedForm.getValues();
      // setNewTriggerData(formValues);
      console.log(formValues);
    }
  }, []);

  // React.useEffect(() => {
  //   console.log('called');

  // if (newTriggerData?.isMandatory) {
  //   mandatoryTriggers.push(newTriggerData);
  // }

  // if (!newTriggerData?.isMandatory) {
  //   optionalTriggers.push(newTriggerData);
  // }
  // if (activeTab === 'manualTrigger') {
  //   const formValues = manualForm.getValues();
  //   setNewTriggerData(formValues);
  // }

  // if (activeTab === 'automatedTrigger') {
  //   const formValues = automatedForm.getValues();
  //   setNewTriggerData(formValues);
  // }
  // }, [newTriggerData]);

  // const [switchStates, setSwitchStates] = React.useState(() => {
  //   const initialStates: any = {};
  //   phaseDetail?.triggers?.forEach(
  //     (trigger: { repeatKey: any; isMandatory: boolean }) => {
  //       initialStates[trigger?.repeatKey] = trigger.isMandatory;
  //     },
  //   );
  //   return initialStates;
  // });

  // const handleSwitchChange = (repeatKey: string, event: any) => {
  //   console.log(event.target.checked);
  //   // const isChecked = event.target.checked;
  //   setSwitchStates((prevState: any) => ({
  //     ...prevState,
  //     [repeatKey]: false,
  //   }));
  // };

  const handleSliderPlus = () => setSliderValue((prev) => prev + 1);
  const handleSliderMinus = () => setSliderValue((prev) => prev - 1);

  const plusBtnDisabled = sliderValue >= 5;
  const minusBtnDisabled = sliderValue <= 0;

  return (
    <>
      <h1 className="text-lg font-semibold mb-6">Configure Phase</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-md font-medium">
              Mandatory Triggers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {mandatoryTriggers?.map((t: any, index: number) => (
                <>
                  <div
                    key={t?.repeatKey}
                    className="flex justify-between items-center h-12"
                  >
                    <p>
                      {index + 1}. {t.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      {/* <Switch
                        id={`switch-${t?.repeatKey}`}
                        checked={switchStates[t?.repeatKey]}
                        onChange={(e) => handleSwitchChange(t?.repeatKey, e)}
                      /> */}
                      {/* <Switch id="isOptional" checked={m.isMandatory} /> */}
                      {/* <Label htmlFor="isOptional">Optional?</Label> */}
                    </div>
                  </div>
                  {index < mandatoryTriggers?.length - 1 && <Separator />}
                </>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-md font-medium">
              Optional Triggers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {optionalTriggers?.map((t: any, index: number) => (
                <>
                  <div className="flex justify-between items-center h-12">
                    <p>
                      {index + 1}. {t.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      {/* <Switch
                        id={`switch-${t?.repeatKey}`}
                        checked={switchStates[t?.repeatKey]}
                        // onClick={(e) => handleSwitchChange(t?.repeatKey, e)}
                        onChange={(e) => handleSwitchChange(t?.repeatKey, e)}
                      /> */}
                      {/* <Switch id="isOptional" checked={o.isOptional} /> */}
                      {/* <Label htmlFor="isOptional">Optional?</Label> */}
                    </div>
                  </div>
                  {index < optionalTriggers?.length - 1 && <Separator />}
                </>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-md font-medium">
              Optional Triggered Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center gap-8">
              <Slider value={[sliderValue]} max={5} step={1} />
              <div className="flex gap-2 items-center">
                <div
                  className={`p-2 rounded border ${
                    minusBtnDisabled ? 'pointer-events-none' : ''
                  }`}
                  onClick={handleSliderMinus}
                >
                  <Minus size={18} />
                </div>
                <div className="px-8 py-2 rounded-md border w-20">
                  {sliderValue}
                </div>
                <div
                  className={`p-2 rounded border ${
                    plusBtnDisabled ? 'pointer-events-none' : ''
                  }`}
                  onClick={handleSliderPlus}
                >
                  <Plus size={18} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
