import { usePathname } from 'next/navigation';

import { Eye, EyeOff, ScreenShareOff, PlusSquare, Import } from 'lucide-react';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { COMMUNICATION_NAV_ROUTE } from '../../const/communication.const';
import { useCampaignStore } from '@rahat-ui/query';

type IProps = {
  onTabChange: (tab: string) => void;
  title: string;
};

export default function Nav({ onTabChange, title }: IProps) {
  const totalTextCampaign = useCampaignStore.getState().totalTextCampaign;
  const totalVoiceCampaign = useCampaignStore.getState().totalVoiceCampaign;

  const path = usePathname().split('/');

  const handleTabClick = (tab: string) => {
    // Notify the parent component about the tab change
    onTabChange(tab);
  };
  return (
    <>
      <div>
        <h1 className="p-4 font-semibold text-xl text-slate-600">
          Communication: {title}
        </h1>
        <ScrollArea className="h-44">
          <div className="px-4 pb-4">
            <nav>
              <div
                onClick={() => {
                  if (path[path.length - 1] === 'text') {
                    handleTabClick(COMMUNICATION_NAV_ROUTE.DEFAULT_TEXT);
                  } else {
                    handleTabClick(COMMUNICATION_NAV_ROUTE.DEFAULT_VOICE);
                  }
                }}
                className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              >
                <div className="flex gap-3">
                  <Eye />
                  <p>Campaign</p>
                </div>
                <p>
                  {path[path.length - 1] === 'text'
                    ? totalTextCampaign
                    : totalVoiceCampaign}
                </p>
              </div>
            </nav>
          </div>
        </ScrollArea>
      </div>
      <Separator />
      <ScrollArea>
        <div className="p-4">
          <h1 className="font-semibold text-xl text-slate-600 mb-4">
            Action Items
          </h1>
          <nav>
            <div
              onClick={() =>
                handleTabClick(COMMUNICATION_NAV_ROUTE.ADD_TEXT_CAMPAIGN)
              }
              className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
            >
              <PlusSquare /> <p>Add</p>
            </div>
            <div className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Import />
              <p>Import</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
