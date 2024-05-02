import { Card, CardContent } from "@rahat-ui/shadcn/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@rahat-ui/shadcn/src/components/ui/select";
import { useState } from "react";

const ActionCards = () => {
    const [vis, setVis] = useState(false)

    const handleValueChange = (val: any) => {
        if (val === '4') {
            setVis(true)
        }else{
            setVis(false)
        }
    }

    return (
        <>
            <div className="flex justify-between my-4">
                <Card className="w-1/2 mr-2">
                    <CardContent className="flex p-4">
                        <div className="flex flex-col justify-between w-full">
                            <div>
                                <div className="flex justify-between">
                                    <p className="font-semibold text-xl mb-2">Communication</p>
                                </div>
                                <Select onValueChange={(val) => handleValueChange(val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            SMS
                                        </SelectItem>
                                        <SelectItem value="2">
                                            EMAIL
                                        </SelectItem>
                                        <SelectItem value="3">
                                            IVR
                                        </SelectItem>
                                        <SelectItem value="4">
                                            PAYOUT
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={`w-1/2 ml-2 ${vis ? 'visible' : 'hidden'}`}>
                    <CardContent className="flex p-4">
                        <div className="flex flex-col justify-between w-full">
                            <div>
                                <div className="flex justify-between">
                                    <p className="font-semibold text-xl mb-2">Payout</p>
                                </div>
                                <p className="font-normal text-sm pr-4">
                                    Total beneficiaries: 20
                                </p>
                                <p className="font-normal text-sm pr-4">
                                    Total tokens: 200
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ActionCards