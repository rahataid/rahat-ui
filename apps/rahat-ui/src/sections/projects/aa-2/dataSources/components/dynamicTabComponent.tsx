import { DailyMonitoringListView } from './dailyMonitoring';
import { DHMSection } from './dhm';
import ExternalLinks from './externalLink/linkContent';
import GaugeReading from './gaugeReading';
import GFHDetails from './gfh';
import { GlofasSection } from './glofas';

interface ComponentWithDateProps {
  GaugeReading: typeof GaugeReading;
}

interface ComponentWithoutProps {
  DHMSection: typeof DHMSection;
  GlofasSection: typeof GlofasSection;
  DailyMonitoringListView: typeof DailyMonitoringListView;
  GFHDetails: typeof GFHDetails;
  ExternalLinks: typeof ExternalLinks;
}

const componentWithDateMap: ComponentWithDateProps = { GaugeReading };
const componentWithoutPropsMap: ComponentWithoutProps = {
  DHMSection,
  GlofasSection,
  DailyMonitoringListView,
  GFHDetails,
  ExternalLinks,
};

export const renderComponent = (componentName: string, date?: Date | null) => {
  if (componentName === 'GaugeReading') {
    const Component = componentWithDateMap[componentName];
    return <Component date={date ?? null} />;
  } else {
    const Component =
      componentWithoutPropsMap[componentName as keyof ComponentWithoutProps];
    return <Component />;
  }
};
