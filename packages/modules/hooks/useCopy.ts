import { useState } from 'react';

const useCopy = () => {
  const [copyAction, setCopyAction] = useState<number | null>(null);

  const clickToCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopyAction(index);

    setTimeout(() => {
      setCopyAction(null);
    }, 2000);
  };

  return { copyAction, clickToCopy };
};

export default useCopy;
