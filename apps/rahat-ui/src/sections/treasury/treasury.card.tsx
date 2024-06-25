import { CircleDollarSign, Folder } from 'lucide-react';
import React from 'react';

type projectIProps = {
  projectBudget: string;
  projectName: string;
};

const TreasuryCard = ({ projectBudget, projectName }: projectIProps) => {
  return (
    <div className="w-96 bg-card border border-neutral-200 rounded-lg p-6 flex flex-col space-x-4">
      <div className="flex items-center">
        <div className="h-12 w-12 flex items-center justify-center rounded-md bg-secondary mr-4">
          <Folder className="text-primary" />
        </div>
        <p className="text-gray-700 font-medium">{projectName}</p>
      </div>
      <div className="flex items-center mt-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center mr-4">
            <CircleDollarSign className="text-primary" />
          </div>
          <div className="flex flex-col ml-2">
            <p className="font-light text-gray-500 text-sm">Budget</p>
            <p className="text-primary font-medium">{projectBudget} RTH</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryCard;
