import Image from 'next/image';
import React from 'react';
const TableLoader = () => {
  return (
    <div className="h-table flex items-center justify-center">
      <Image
        className="animate-pulse opacity-10"
        alt="rahat logo"
        src={'/rahat_logo_standard.png'}
        height={150}
        width={350}
      />
    </div>
  );
};
export default TableLoader;
