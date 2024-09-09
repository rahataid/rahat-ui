'use client';
import { useListAllTransports } from '@rahat-ui/community-query';
import React from 'react';

function ViewComms() {
  const tran = useListAllTransports();
  console.log(tran);
  return <div>VIEWCOMMS</div>;
}

export default ViewComms;
