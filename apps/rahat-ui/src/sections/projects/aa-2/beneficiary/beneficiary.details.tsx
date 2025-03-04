'use client';
import React from 'react';
import HeaderWithBack from '../../../common/header.with.back';
import BeneficiaryInfo from './beneficiary.info';
import TransactionLogs from './transaction.log';

const BeneficiaryDetail = () => {
  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={'Beneficiary Details'}
          subtitle="Detailed view of the selected beneficiary"
          path="/beneficiary"
        />
      </div>

      <div className="flex">
        <div className="flex border rounded-lg flex-col gap-4 p-4 mx-4  w-full">
          <BeneficiaryInfo />
        </div>

        <div className="flex border flex-col rounded-lg  gap-4 p-4 mx-4  w-full ">
          <TransactionLogs />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetail;
