import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

type IProps = {
  handleAddTrigger: (data: any) => void;
  prevStep: VoidFunction;
  manualForm: UseFormReturn<
    {
      title: string;
    },
    any,
    undefined
  >;
  automatedForm: UseFormReturn<
    {
      title: string;
      dataSource: string;
      minLeadTimeDays: string;
      maxLeadTimeDays: string;
      probability: string;
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
  prevStep,
  handleAddTrigger,
}: IProps) {
  const { id: projectID } = useParams();
  const mandatoryTriggers = phaseDetail?.triggers?.filter(
    (d: any) => d?.isMandatory,
  );
  const optionalTriggers = phaseDetail?.triggers?.filter(
    (d: any) => !d?.isMandatory,
  );

  const [newTriggerData, setNewTriggerData] = React.useState<any>({});

  const [allMandatoryTriggers, setAllMandatoryTriggers] =
    React.useState<any>(mandatoryTriggers);

  const [allOptionalTriggers, setAllOptionalTriggers] =
    React.useState<any>(optionalTriggers);

  const [sliderValue, setSliderValue] = React.useState(
    phaseDetail?.requiredOptionalTriggers,
  );

  React.useEffect(() => {
    if (activeTab === 'manualTrigger') {
      const formValues = manualForm.getValues();
      setNewTriggerData(formValues);
    }

    if (activeTab === 'automatedTrigger') {
      const formValues = automatedForm.getValues();
      setNewTriggerData(formValues);
    }
  }, []);

  React.useEffect(() => {
    const isEmpty = (obj: any) => Object.keys(obj).length === 0;
    if (!isEmpty(newTriggerData)) {
      if (newTriggerData?.isMandatory) {
        setAllMandatoryTriggers([...mandatoryTriggers, newTriggerData]);
      } else {
        setAllOptionalTriggers([...optionalTriggers, newTriggerData]);
      }
    } else return;
  }, [newTriggerData]);

  const handleSliderPlus = () => setSliderValue((prev: number) => prev + 1);
  const handleSliderMinus = () => setSliderValue((prev: number) => prev - 1);

  const plusBtnDisabled = sliderValue >= allOptionalTriggers.length;
  const minusBtnDisabled = sliderValue <= 0;

  return (
    <>
      <h1 className="text-lg font-semibold mb-6">Configure Phase</h1>
      <div className="bg-secondary p-2 pr-0 rounded">
        <ScrollArea className="h-[calc(100vh-385px)] pr-2">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-md font-medium">
                  Mandatory Triggers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  {allMandatoryTriggers?.length
                    ? allMandatoryTriggers?.map((t: any, index: number) => (
                        <>
                          <div
                            key={t?.repeatKey}
                            className="flex justify-between items-center h-12"
                          >
                            <p>
                              {index + 1}. {t.title}
                            </p>
                            <div className="flex items-center space-x-2"></div>
                          </div>
                          {index < allMandatoryTriggers?.length - 1 && (
                            <Separator />
                          )}
                        </>
                      ))
                    : 'No data'}
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
                  {allOptionalTriggers?.length
                    ? allOptionalTriggers?.map((t: any, index: number) => (
                        <>
                          <div className="flex justify-between items-center h-12">
                            <p>
                              {index + 1}. {t.title}
                            </p>
                            <div className="flex items-center space-x-2"></div>
                          </div>
                          {index < allOptionalTriggers?.length - 1 && (
                            <Separator />
                          )}
                        </>
                      ))
                    : 'No data'}
                </div>
              </CardContent>
            </Card>
            {allOptionalTriggers?.length ? (
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-md font-medium">
                    Optional Triggered Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center gap-8">
                    <Slider
                      value={[sliderValue]}
                      max={allOptionalTriggers.length}
                      step={1}
                    />
                    <div className="flex gap-2 items-center">
                      <div
                        className={`p-2 rounded border ${
                          minusBtnDisabled
                            ? 'pointer-events-none'
                            : 'cursor-pointer'
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
                          plusBtnDisabled
                            ? 'pointer-events-none'
                            : 'cursor-pointer'
                        }`}
                        onClick={handleSliderPlus}
                      >
                        <Plus size={18} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </ScrollArea>
      </div>
      <div className="flex justify-end mt-8">
        <div className="flex gap-2">
          <Link href={`/projects/aa/${projectID}/trigger-statements`}>
            <Button
              type="button"
              variant="secondary"
              className="bg-red-100 text-red-600 w-36 hover:bg-red-200"
            >
              Cancel
            </Button>
          </Link>
          <Button onClick={prevStep}>Previous</Button>
          <Button
            onClick={() =>
              handleAddTrigger({
                newTriggerData,
                allMandatoryTriggers,
                allOptionalTriggers,
                requiredOptionalTriggers: sliderValue,
              })
            }
            type="submit"
          >
            Add Trigger Statement
          </Button>
        </div>
      </div>
    </>
  );
}
