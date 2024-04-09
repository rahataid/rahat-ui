import React from 'react';

const DiscountVoucherInfo = ({ data }) => {
  return (
    <div className="m-2 rounded bg-card p-4 shadow">
      <div className="flex items-center flex-wrap mt-2 gap-10 md:gap-32">
        <div>
          <p className="font-medium text-primary">Discount</p>
          <p className="font-light">Voucher Name</p>
        </div>
        <div>
          <p className="font-medium text-primary">
            {data?.referredVoucherPrice}
          </p>
          <p className="font-light">
            Price in {data?.referredVoucherCurrency || ''}
          </p>
        </div>
        <div>
          <p className="font-medium text-primary">
            {data?.referredVoucherBudget || 0}
          </p>
          <p className="font-light">No. of Voucher Minted</p>
        </div>
      </div>
      <div>
        <p className="mt-4 sm:mt-8 sm:w-2/3">
          {data?.referredVoucherDescription}
        </p>
      </div>
    </div>
  );
};

export default DiscountVoucherInfo;
