import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { User, Users } from 'lucide-react';

export default function CreateDisbursementSelectionType() {
  const cardData = [
    {
      title: 'SELECT INDIVIDUAL BENEFICIARY',
      description: 'Select beneficiaries individually to disburse amount',
      icon: <User className="w-5 h-5 text-primary" />,
    },
    {
      title: 'SELECT BENEFICIARY GROUP',
      description: 'Select beneficiary group to disburse amount',
      icon: <Users className="w-5 h-5 text-primary" />,
    },
  ];
  return (
    <div className="p-4 border rounded-sm mt-4">
      <h1 className="text-sm/6 font-semibold text-gray-900 mb-4">
        Pick a selection type
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cardData?.map((card, index) => (
          <Card
            key={`${index}-${card.title}`}
            className="rounded-sm cursor-pointer hover:shadow-md transition-shadow duration-200 border-gray-200"
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
