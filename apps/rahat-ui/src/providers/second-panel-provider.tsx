'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// Create a context
const SecondPanelContext = createContext<{
  secondPanel: ReactNode;
  setSecondPanelComponent: (component: ReactNode) => void;
  closeSecondPanel: () => void;
} | null>(null);

interface SecondPanelProviderProps {
  children: ReactNode;
}

// Create a provider component
export const SecondPanelProvider: React.FC<SecondPanelProviderProps> = ({
  children,
}) => {
  const [secondPanel, setSecondPanel] = useState<ReactNode>(null);
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    setSecondPanel(null);
  }, [pathname]);

  const setSecondPanelComponent = useCallback(
    (component: ReactNode) => {
      setSecondPanel(component);
    },
    [setSecondPanel],
  );

  const closeSecondPanel = useCallback(() => {
    setSecondPanel(null);
  }, [setSecondPanel]);
  console.log('secondPanel', secondPanel);
  const value = useMemo(
    () => ({
      secondPanel,
      setSecondPanelComponent,
      closeSecondPanel,
    }),
    [closeSecondPanel, secondPanel, setSecondPanelComponent],
  );

  return (
    <SecondPanelContext.Provider value={value}>
      {children}
    </SecondPanelContext.Provider>
  );
};

// Create a hook to use the context
export const useSecondPanel = () => {
  const context = useContext(SecondPanelContext);
  if (!context) {
    throw new Error('useSecondPanel must be used within a SecondPanelProvider');
  }
  return context;
};
