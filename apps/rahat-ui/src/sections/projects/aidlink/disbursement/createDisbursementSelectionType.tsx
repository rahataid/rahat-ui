import React from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { User, Users } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import CreateDisbursementMain from './createDisbursementMain';
import { DisbursementSelectionType } from '@rahat-ui/query';

const CancelBtn = ({
  setSelectedType,
}: {
  setSelectedType: React.Dispatch<
    React.SetStateAction<DisbursementSelectionType | null>
  >;
}) => {
  return (
    <div className="mt-4 flex justify-end">
      <Button
        type="button"
        className="w-72 bg-slate-500 hover:bg-slate-600"
        onClick={() => setSelectedType(null)}
      >
        Cancel
      </Button>
    </div>
  );
};

export default function CreateDisbursementSelectionType() {
  const [selectedType, setSelectedType] =
    React.useState<DisbursementSelectionType | null>(null);

  const cardData = [
    {
      type: DisbursementSelectionType.INDIVIDUAL,
      title: 'SELECT INDIVIDUAL BENEFICIARY',
      description: 'Select beneficiaries individually to disburse amount',
      icon: <User className="w-5 h-5 text-primary" />,
    },
    {
      type: DisbursementSelectionType.GROUP,
      title: 'SELECT BENEFICIARY GROUP',
      description: 'Select beneficiary group to disburse amount',
      icon: <Users className="w-5 h-5 text-primary" />,
    },
  ];

  return selectedType ? (
    <>
      <CreateDisbursementMain type={selectedType} />
      <CancelBtn setSelectedType={setSelectedType} />
    </>
  ) : (
    <div className="p-4 border rounded-sm mt-4 bg-card">
      <h1 className="text-sm/6 font-semibold text-gray-900 mb-4">
        Pick a selection type
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cardData?.map((card, index) => (
          <Card
            key={`${index}-${card.title}`}
            className="rounded-sm cursor-pointer hover:shadow-md transition-shadow duration-200 border-gray-200"
            onClick={() => setSelectedType(card.type)}
          >
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-sm flex items-center justify-center mx-auto mb-4">
                {card.icon}
              </div>
              <h2 className="text-xs tracking-widest font-semibold text-gray-900 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm/4">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
