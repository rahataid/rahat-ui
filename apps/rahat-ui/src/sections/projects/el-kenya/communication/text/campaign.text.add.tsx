import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';

import AddSmsForm from '../communication.sms.add';

import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@rahat-ui/shadcn/src/components/ui/drawer';

const TextCampaignAddDrawer = () => {
  const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <ArrowLeft
          onClick={() => router.back()}
          className="cursor-pointer"
          size={20}
          strokeWidth={1.5}
        />
      </div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Card
            onClick={() => setIsOpen(true)}
            className="flex rounded justify-center border-dashed border-2 border-primary shadow bg-card cursor-pointer hover:shadow-md ease-in duration-300"
          >
            <CardContent className="flex items-center justify-center">
              <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mt-2">
                <Plus className="text-primary" size={20} strokeWidth={1.5} />
              </div>
            </CardContent>
          </Card>
        </DrawerTrigger>
        <DrawerContent className="min-h-96">
          <AddSmsForm setIsOpen={setIsOpen} />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default TextCampaignAddDrawer;
