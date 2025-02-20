export function mapStatus(status: string) {
  const statusMapping: any = {
    CHECKED: 'Eye Checkup',
    PURCHASE_OF_GLASSES: 'Purchase of Glasses',
    READING_GLASSES: 'Reading Glasses',
    SUN_GLASSES: 'Sun Glasses',
    PRESCRIBED_LENSES: 'Prescribed Lenses',
    REDEEMED: 'Redeemed',
    NOT_REDEEMED: 'Not Redeemed',
    yes: 'Yes',
    no: 'No',
  };
  return statusMapping[status] || '-';
}
export function mapTopic(topic: string) {
  const topicMapping: any = {
    'Walk In Beneficiary Added': 'Consumer Added',
  };
  return topicMapping[topic] || topic;
}
