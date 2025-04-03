'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { FC, useState, useEffect } from 'react';
import { NavItem } from './nav-items.types';

type VendorsLayoutProps = {
  children: React.ReactNode | React.ReactNode[];
  menuItems?: NavItem[];
};

const VendorsLayout: FC<VendorsLayoutProps> = ({ children, menuItems }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize); // Listen for resize events

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup on unmount
    };
  }, []);

  return (
    <>
      {isMobile ? (
        // Fullscreen panel on mobile
        <div className="fixed inset-0 w-full h-full z-50 bg-white overflow-auto">
          {children}
        </div>
      ) : (
        // Resizable panels on desktop
        <ResizablePanelGroup direction="horizontal">
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <ResizablePanel key={index}>{child}</ResizablePanel>
            ))
          ) : (
            <ResizablePanel>{children}</ResizablePanel>
          )}
        </ResizablePanelGroup>
      )}
    </>
  );
};

export default VendorsLayout;
