'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { EditDailyMonitoring } from 'apps/rahat-ui/src/sections/projects/aa-2/dataSources/components';
import { AADataSourcesDailyMonitoringEditView } from 'apps/rahat-ui/src/sections/projects/aa/data-sources/daily-monitoring';
// import EditDailyMonitoring from 'apps/rahat-ui/src/sections/projects/aa/data-sources/daily-monitoring/edit/edit.daily.monitoring.view';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <EditDailyMonitoring />
    </RoleAuth>
  );
};

export default Page;
