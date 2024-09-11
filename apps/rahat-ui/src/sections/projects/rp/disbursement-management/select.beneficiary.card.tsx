import {
  Avatar,
  AvatarFallback,
} from '@rahat-ui/shadcn/src/components/ui/avatar';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { previousDay } from 'date-fns';
import { BadgePlus, Users, Phone } from 'lucide-react';
import GroupDisbursementAssignModel from './group-assign-disbursement-amount.modal';

type BeneficiaryCardProps = {
  name: string;
  uuid: string;
  totalBeneficiary: string;
  handleCreateDisbursement: (amount: number, groupUUid: string) => void;
  setSelectedGroupId: any;
  selectedGroupId: string[];
  totalAmount: number;
};
export default function BeneficiaryCard({
  name,
  uuid,
  totalBeneficiary,
  handleCreateDisbursement,
  setSelectedGroupId,
  selectedGroupId,
  totalAmount,
}: BeneficiaryCardProps) {
  return (
    <Card className="shadow-md border">
      <CardHeader className="relative">
        <Checkbox
          onCheckedChange={(e: boolean) => {
            if (e) {
              setSelectedGroupId((prev) => [...prev, uuid]);
            } else {
              const filteredSelected = selectedGroupId.filter(
                (id) => id !== uuid,
              );
              setSelectedGroupId(filteredSelected);
            }
          }}
          className="absolute top-2 left-2"
        />
        <div className="flex justify-center mt-6">
          <Avatar className="w-24 h-24 bg-gray-100">
            <AvatarFallback>
              <Users className="w-8 h-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="text-left">
        <div className="flex justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              RP
            </Badge>
            <CardTitle className="text-gray-800 font-medium text-base">
              {name}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Users className="w-4 h-4 mr-1" />
              <span>{totalBeneficiary}</span>
            </div>
          </div>
          <div className="flex text-sm text-gray-500 mt-16">
            <Users className="w-4 h-4 mr-1" />
            <span>{totalAmount}</span>
          </div>
        </div>

        <GroupDisbursementAssignModel
          uuid={uuid}
          handleSubmit={handleCreateDisbursement}
          bulk={false}
        />
      </CardContent>
    </Card>
  );
}
