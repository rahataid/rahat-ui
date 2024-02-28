import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';
import InfoCards from './infoCards';

export default function BeneficiaryDetailPageView() {
  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="min-h-max border">
        <ResizablePanel
          minSize={20}
          defaultSize={20}
          maxSize={20}
          className="h-full"
        >
          <InfoCards />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}></ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
