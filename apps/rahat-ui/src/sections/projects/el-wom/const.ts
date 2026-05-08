export function mapTopic(topic: string) {
  const topicMapping: any = {
    'Walk In Beneficiary Added': 'Voucher Redeemed',
    NOT_REDEEM_STATS: 'Total Inactive Consumers',
    NOT_REQUIRED: 'Not Redeemed',
    REDEMPTION_STATS: 'Glass Purchase Type',
    VOUCHER_USAGE_TYPE_STATS: 'Voucher Usage Type',
  };
  return topicMapping[topic] || topic;
}
