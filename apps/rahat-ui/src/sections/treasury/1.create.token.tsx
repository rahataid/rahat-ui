import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import React from 'react';
import { useTranslations } from 'next-intl';

const CreateToken = ({ handleStepDataChange, stepData }) => {
  const t = useTranslations('Treasury – Create Token');
  const tg = useTranslations('GLOBAL');
  return (
    <div className="grid grid-cols-12 p-4 h-[calc(100vh-482px)] ">
      <div className="col-span-12 bg-card rounded-sm p-4">
        <h1 className="text-gray-700 text-xl font-medium">
          {t('CREATE_YOUR_ERC20_TOKEN')}
        </h1>
        <div className="col-span-6">
          <div className="h-full rounded-sm mt-8">
            <div className="flex flex-col gap-8">
              <div className="grid w-1/2 items-center gap-1.5">
                <Label htmlFor="tokenName">{t('TOKEN_NAME')}</Label>
                <Input
                  type="tokenName"
                  name="tokenName"
                  placeholder={t('ENTER_YOUR_TOKEN_NAME')}
                  onChange={handleStepDataChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid w-1/2 items-center gap-1.5">
                  <Label htmlFor="symbol">{t('TOKEN_SYMBOL')}</Label>
                  <Input
                    type="symbol"
                    name="symbol"
                    onChange={handleStepDataChange}
                    placeholder={t('ENTER_YOUR_TOKEN_SYMBOL')}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid w-1/2 items-center gap-1.5">
                  <Label htmlFor="initialSupply">{t('TOKEN_INITIAL_SUPPLY')}</Label>
                  <Input
                    inputMode="numeric"
                    type="initialSupply"
                    name="initialSupply"
                    onChange={handleStepDataChange}
                    placeholder={t('ENTER_YOUR_TOKEN_INITIAL_SUPPLY')}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid w-1/2 items-center gap-1.5">
                  <Label htmlFor="email">{tg('DESCRIPTION')}</Label>
                  <Textarea
                    placeholder={tg('TYPE_YOUR_MESSAGE_HERE')}
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
