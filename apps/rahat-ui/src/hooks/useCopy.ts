import { useState } from 'react';

const useCopy = () => {
  const [copyAction, setCopyAction] = useState<number | null | string>(null);

  const clickToCopy = (text: string, index: number | string) => {
    navigator.clipboard.writeText(text);
    setCopyAction(index);

    setTimeout(() => {
      setCopyAction(null);
    }, 5000);
  };

  return { copyAction, clickToCopy };
};

export default useCopy;
