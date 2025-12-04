import React, { useMemo } from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { AlertCircle, User, Users } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import CreateDisbursementMain from './createDisbursementMain';
import { DisbursementSelectionType, useGetSafePending } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import Loader from 'apps/community-tool-ui/src/components/Loader';

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

interface ICreateDisbursementSelectionTypeProps {
  setActiveTab: (tab: string) => void;
}

export default function CreateDisbursementSelectionType({
  setActiveTab,
}: ICreateDisbursementSelectionTypeProps) {
  const { id: projectUUID } = useParams() as { id: UUID };
  const [selectedType, setSelectedType] =
    React.useState<DisbursementSelectionType | null>(null);

  const { data, isLoading } = useGetSafePending(projectUUID);

  const cardData = useMemo(
    () => [
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
    ],

    [],
  );
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader />
      </div>
    );
  }

  if (data?.count > 0 && !selectedType) {
    return (
      <div className="flex flex-col justify-center items-center mt-10 bg-gray-50 px-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-3">
          <AlertCircle className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-3">Attention</h2>
        <p className="text-center text-gray-600 max-w-2xl mb-8 leading-relaxed">
          A pending multisig transaction already exists for this project. <br />
          Please update the current transaction before creating a new one to
          ensure proper processing and avoid conflicts.
        </p>

        <Button
          size="lg"
          className="bg-gray-500 hover:bg-gray-500 text-white px-8 rounded-full shadow-md transition"
          onClick={() => setActiveTab('disbursementHistory')}
        >
          Disbursement History
        </Button>
      </div>
    );
  }

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
