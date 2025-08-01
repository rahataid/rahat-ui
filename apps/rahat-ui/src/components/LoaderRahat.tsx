import Image from 'next/image';
import React from 'react';

const LoaderRahat = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Image
        className="animate-pulse"
        alt="rahat logo"
        src={'/rahat_logo_standard.png'}
        height={250}
        width={550}
      />
    </div>
  );
};

export default LoaderRahat;
