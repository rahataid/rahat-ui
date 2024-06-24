import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import React from 'react';

const CreateToken = ({ handleStepDataChange, stepData }) => {
  return (
    <div className="grid grid-cols-12 p-4 h-[calc(100vh-482px)] ">
      <div className="col-span-12 bg-card rounded-sm p-4">
        <h1 className="text-gray-700 text-xl font-medium">
          Create your ERC20 Token
        </h1>
        <div className="col-span-6">
          <div className="h-full rounded-sm mt-8">
            <div className="flex flex-col gap-8">
              <div className="grid w-1/2 items-center gap-1.5">
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  type="tokenName"
                  name="tokenName"
                  placeholder="Enter your token name"
                  onChange={handleStepDataChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid w-1/2 items-center gap-1.5">
                  <Label htmlFor="symbol">Token Symbol</Label>
                  <Input
                    type="symbol"
                    name="symbol"
                    onChange={handleStepDataChange}
                    placeholder="Enter your token symbol"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid w-1/2 items-center gap-1.5">
                  <Label htmlFor="count">Token Count</Label>
                  <Input
                    type="count"
                    name="count"
                    onChange={handleStepDataChange}
                    placeholder="Enter your token count"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid w-1/2 items-center gap-1.5">
                  <Label htmlFor="email">Description</Label>
                  <Textarea
                    placeholder="Type your message here."
                    name="description"
                    onChange={handleStepDataChange}
                  />
                  {/* <Input
                    type="description"
                    id="description"
                    placeholder="Write token description"
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateToken;
