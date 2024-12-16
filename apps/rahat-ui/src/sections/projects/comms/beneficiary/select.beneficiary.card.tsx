import {
  Avatar,
  AvatarFallback,
} from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

import { Users, ArrowRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';


type BeneficiaryCardProps = {
  name: string;
  uuid: string;
  totalBeneficiary: string;
};
export default function BeneficiaryCard({
  name,
  uuid,
  totalBeneficiary,
}: BeneficiaryCardProps) {
  const router = useRouter();
  const { id } = useParams();
  return (
    <Card className="shadow-md border">
      <CardHeader className="relative">
        <Checkbox
          onCheckedChange={(e: boolean) => {}}
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
          <div
            onClick={() =>
              router.push(`/projects/rp/${id}/beneficiary/${uuid}`)
            }
            className="mt-12 w-12 h-12 bg-blue-100 rounded-full flex justify-center items-center cursor-pointer"
          >
            <ArrowRight
              className="z-10"
              size={24}
              color="#297AD6"
              strokeWidth={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
