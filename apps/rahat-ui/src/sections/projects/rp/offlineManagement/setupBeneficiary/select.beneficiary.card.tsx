import {
  Avatar,
  AvatarFallback,
} from '@rahat-ui/shadcn/src/components/ui/avatar';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Users } from 'lucide-react';

type BeneficiaryCardProps = {
  name: string;
  uuid: string;
  totalBeneficiary: string;
  handleGroupChecked: (v: boolean, uuid: string) => void;
};
export default function BeneficiaryCard({
  name,
  uuid,
  totalBeneficiary,
  handleGroupChecked,
}: BeneficiaryCardProps) {
  return (
    <Card className="shadow-md border">
      <CardHeader className="relative">
        <Checkbox
          onCheckedChange={(e: boolean) => {
            handleGroupChecked(e, uuid);
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
      </CardContent>
    </Card>
  );
}
