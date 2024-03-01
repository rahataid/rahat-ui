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
    <Accordion type="single" collapsible className="px-4 pb-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="no-underline bg-muted hover:bg-primary p-4 rounded-sm hover:text-white mb-2">
          Filter Options
        </AccordionTrigger>
        <AccordionContent>
          <div className="shadow-md">
            <RadioGroup
              defaultValue="comfortable"
              className="p-4 flex flex-col gap-4 "
            >
              <div className="flex items-center space-x-2">
                {/* <RadioGroupItem value="location" id="r1" /> */}
                <Input type="text" id="search" placeholder="Search Location" />
                {/* <Label htmlFor="search">Location</Label> */}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internetStatus" id="r2" />
                <Label htmlFor="r2">Internet Status</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bankStatus" id="r3" />
                <Label htmlFor="r3">Bank Status</Label>
              </div>
            </RadioGroup>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
