const generateOTP = (index: number): string => {
  const fixedPart = '123';
  const incrementalPart = (index + 1).toString().padStart(2, '0'); // Last two digits, padded to two digits
  return `${fixedPart}${incrementalPart}`;
};

export const generateCSVData = (beneficiaries: any, disbursementList: any) => {
  const csvRows = [];
  const headers = ['phone', 'id', 'amount', 'verification', 'paymentID'];
  csvRows.push(headers.join(','));

  beneficiaries.forEach((beneficiary: any, index: number) => {
    const disbursement = disbursementList.find(
      (d: any) => d.walletAddress === beneficiary.walletAddress,
    );

    const phone = beneficiary.phone || 'N/A';
    const id = `beneficiary_${index}`;
    const amount = disbursement?.amount || 0;
    const verification = '1111';
    const paymentID = `PAY_${index}`;

    csvRows.push([phone, id, amount, verification, paymentID].join(','));
  });

  return csvRows.join('\n');
};
