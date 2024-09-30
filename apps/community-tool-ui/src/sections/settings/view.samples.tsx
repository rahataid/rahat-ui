'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@rahat-ui/shadcn/src/components/ui/accordion';
import { SETTINGS_SAMPLE } from './data';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
export function ViewSamples() {
  const [copyAction, setCopyAction] = useState<number>();
  const clickToCopy = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopyAction(index);
  };
  return (
    <div className="m-1 p-6 h-[calc(100vh-78px)] border bg-white shadow-lg">
      <h1 className="text-xl md:text-xl font-bold mb-6 text-gray-800">
        Settings Sample
      </h1>
      <Accordion type="single" collapsible className="w-full m-auto">
        {SETTINGS_SAMPLE.map((setting, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg md:text-lg p-2 hover:bg-gray-700 hover:text-white border-2 font-semibold mb-2 transition-all duration-200">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Label className="text-base">{setting.name}</Label>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </AccordionTrigger>
            <AccordionContent className="mt-2 text-gray-600 ml-4">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger
                    className=" flex gap-3 cursor-pointer"
                    onClick={() => clickToCopy(setting.name, index)}
                  >
                    <Label className="text-base text-black">
                      {setting.name}
                    </Label>
                    {copyAction === index ? (
                      <CopyCheck size={20} strokeWidth={1.5} />
                    ) : (
                      <Copy size={20} strokeWidth={1.5} />
                    )}
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-secondary ml-2 p-1"
                    side="right"
                  >
                    <p className="text-xs font-medium ">
                      {copyAction === index ? 'copied' : `click to copy`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex flex-col mb-2">
                <Label className="text-base">{setting.description}</Label>
                <Label className="mr-5 mt-3">
                  <span className="text-base">
                    <strong>Required Fields:</strong>
                  </span>
                  <span className="text-sm ml-5">{setting.requiredFields}</span>
                </Label>
              </div>
              <div className="grid mt-4 grid-cols-2 gap-4 mb-4 text-black">
                <>
                  <Label className="col-span-1">
                    <strong>Key</strong>
                  </Label>
                  <Label className="col-span-1">
                    <strong>Value</strong>
                  </Label>
                </>
              </div>
              <div className="grid grid-cols-1 gap-4 mb-2">
                {setting.key_value.map((kv, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-2 gap-2 text-gray-600"
                  >
                    <span className="font-medium text-gray-700">{kv.key}</span>
                    <span>{kv.value}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
