'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@rahat-ui/shadcn/components/accordion';
import { Label } from '@rahat-ui/shadcn/components/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/components/radio-group';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

export default function Filter() {
  return (
    <Accordion type="single" collapsible className="px-2 pb-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="no-underline bg-muted hover:bg-primary p-2 rounded-sm hover:text-white text-primary">
          Filter Options
        </AccordionTrigger>
        <AccordionContent className="p-2">
          <div className="">
            <div className="flex items-center space-x-2 mb-2">
              <Input type="text" id="search" placeholder="Search Location" />
            </div>
            <div className="flex items-center space-x-2">
              <Accordion type="single" collapsible className="px-2 pb-4 w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="no-underline hover:bg-muted p-2 rounded">
                    Internet Status
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">No Internet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Phone Internet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="option-three"
                          id="option-three"
                        />
                        <Label htmlFor="option-three">Home Internet</Label>
                      </div>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
