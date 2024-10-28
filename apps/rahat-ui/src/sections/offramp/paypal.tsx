'use client';
import { Banknote } from 'lucide-react';
import DataCard from '../../components/dataCard';
import PaypalForm from './paypalForm';

const Paypal = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <DataCard
          className="my-2 mx-2"
          title="Connected Wallet"
          smallNumber={`Paypal`}
          Icon={Banknote}
        />
        <DataCard
          className="my-2 mx-2"
          title="USDC Amount"
          smallNumber={`123`}
          Icon={Banknote}
        />
      </div>
      <PaypalForm />
    </div>
  );
};

export default Paypal;
