'use client';
import { Banknote } from 'lucide-react';
import DataCard from '../../components/dataCard';
import KotaniPayForm from './kotaniPayForm';

const KotaniPay = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <DataCard
          className="my-2 mx-2"
          title="Connected Wallet"
          smallNumber={`KotaniPay`}
          Icon={Banknote}
        />
        <DataCard
          className="my-2 mx-2"
          title="USDC Amount"
          smallNumber={`123`}
          Icon={Banknote}
        />
      </div>
      <KotaniPayForm />
    </div>
  );
};

export default KotaniPay;
