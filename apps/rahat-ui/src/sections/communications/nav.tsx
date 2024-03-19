import { usePathname } from 'next/navigation';

import { useCampaignStore } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { Eye, PlusSquare } from 'lucide-react';
import { COMMUNICATION_NAV_ROUTE } from '../../constants/communication.const';
import { CAMPAIGN_PATH } from '@rahat-ui/types';

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
        <h1 className="p-4 font-semibold text-xl text-primary">
          Communication: {title}
        </h1>
        <ScrollArea>
          <div className="px-4 pb-4">
            <nav>
              <div
                onClick={() => {
                  if (path[path.length - 1] === CAMPAIGN_PATH.TEXT) {
                    handleTabClick(COMMUNICATION_NAV_ROUTE.DEFAULT_TEXT);
                  } else {
                    handleTabClick(COMMUNICATION_NAV_ROUTE.DEFAULT_VOICE);
                  }
                }}
                className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
              >
                <div className="flex items-center gap-3">
                  <Eye size={20} strokeWidth={1.5} />
                  <p>Campaign</p>
                </div>
                <p>
                  {path[path.length - 1] === CAMPAIGN_PATH.TEXT
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
          {/* <h1 className="font-semibold text-xl text-slate-600 mb-4">
            Action Items
          </h1> */}
          <nav>
            <div
              onClick={() =>
                handleTabClick(COMMUNICATION_NAV_ROUTE.ADD_TEXT_CAMPAIGN)
              }
              className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
            >
              <PlusSquare size={20} strokeWidth={1.5} /> <p>Add</p>
            </div>
            {/* <div className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground">
              <Import size={20} strokeWidth={1.5} />
              <p>Import</p>
            </div> */}
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
