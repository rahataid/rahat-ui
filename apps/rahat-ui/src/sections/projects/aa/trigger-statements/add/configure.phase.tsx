import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@rahat-ui/shadcn/src/components/ui/card";
import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import { Switch } from "@rahat-ui/shadcn/src/components/ui/switch";
import { Label } from "@rahat-ui/shadcn/src/components/ui/label";
import { Separator } from "@rahat-ui/shadcn/src/components/ui/separator";
import { Slider } from "@rahat-ui/shadcn/src/components/ui/slider";
import { Minus, Plus } from "lucide-react";

const MandatoryTriggers = [{ title: "Trigger 1", isOptional: false }, { title: "Trigger 2", isOptional: false }]
const OptionalTriggers = [{ title: "Trigger 3", isOptional: true }, { title: "Trigger 4", isOptional: true }]

type IProps = {
    previous: VoidFunction
}

export default function ConfigurePhase({ previous }: IProps) {
    const [sliderValue, setSliderValue] = React.useState(1)

    const handleSliderPlus = () => setSliderValue(prev => prev + 1)
    const handleSliderMinus = () => setSliderValue(prev => prev - 1)

    const plusBtnDisabled = sliderValue >= 5
    const minusBtnDisabled = sliderValue <= 0
    return (
        <>
            <h1 className="text-lg font-semibold mb-6">Configure Phase</h1>
            <div className="grid gap-4">
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-medium">Mandatory Triggers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            {MandatoryTriggers.map((m, index) => (
                                <>
                                    <div className="flex justify-between items-center h-12">
                                        <p>{index + 1}. {m.title}</p>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="isOptional" checked={m.isOptional} />
                                            <Label htmlFor="isOptional">Optional?</Label>
                                        </div>
                                    </div>
                                    {index < MandatoryTriggers.length - 1 && <Separator />}
                                </>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-medium">Optional Triggers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            {OptionalTriggers.map((o, index) => (
                                <>
                                    <div className="flex justify-between items-center h-12">
                                        <p>{index + 1}. {o.title}</p>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="isOptional" checked={o.isOptional} />
                                            <Label htmlFor="isOptional">Optional?</Label>
                                        </div>
                                    </div>
                                    {index < OptionalTriggers.length - 1 && <Separator />}
                                </>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-medium">Optional Triggered Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex justify-between items-center gap-8'>
                            <Slider value={[sliderValue]} max={5} step={1} />
                            <div className='flex gap-2 items-center'>
                                <div className={`p-2 rounded border ${minusBtnDisabled ? "pointer-events-none" : ''}`} onClick={handleSliderMinus}><Minus size={18} /></div>
                                <div className="px-8 py-2 rounded-md border w-20">{sliderValue}</div>
                                <div className={`p-2 rounded border ${plusBtnDisabled ? 'pointer-events-none' : ''}`} onClick={handleSliderPlus}><Plus size={18} /></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-end mt-8">
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        className="bg-red-100 text-red-600 w-36"
                        disabled
                    >
                        Cancel
                    </Button>
                    <Button onClick={previous}>Previous</Button>
                    <Button type="submit">Add Trigger Statement</Button>
                </div>
            </div>
        </>
    )
}