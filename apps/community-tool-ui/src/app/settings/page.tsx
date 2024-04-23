'use client';
import { useCallback, useState } from 'react';
import { SETTINGS_NAV_ROUTE } from '../../constants/settings.const';
import ListSetting from '../../sections/settings/list.settings';

export default function SettingsPage() {
  const [active, setActive] = useState<string>(SETTINGS_NAV_ROUTE.DEFAULT);
  const handleNav = useCallback((item: string) => {
    setActive(item);
  }, []);
  return (
    // <Tabs defaultValue="list" className="h-full">
    //   <ResizablePanelGroup direction="horizontal" className="min-h-max bg-card">
    //     <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
    //       <SettingNav title="Settings" handleNav={handleNav} />
    //     </ResizablePanel>
    //     <ResizableHandle />
    //     <ResizablePanel minSize={28}>
    //       {active === SETTINGS_NAV_ROUTE.DEFAULT && <ListSetting />}

    //       {active === SETTINGS_NAV_ROUTE.ADD_SETTINGS && <AddSetting />}
    //     </ResizablePanel>
    //   </ResizablePanelGroup>
    // </Tabs>
    <ListSetting />
  );
}
