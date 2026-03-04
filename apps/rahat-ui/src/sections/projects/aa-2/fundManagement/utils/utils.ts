import { PayoutType } from '@rahat-ui/query';
import { PayoutFormData } from '../components/assign.payout.form';

export function handleBuildPayoutPayload(payoutData: PayoutFormData | null) {
  if (!payoutData?.method || !payoutData.mode) return undefined;
  if (!Object.keys(payoutData.group ?? {}).length) return undefined;

  const base: Record<string, any> = {
    type: payoutData.method === 'CVA' ? PayoutType.VENDOR : payoutData.method,
    mode: payoutData.mode,
  };

  if (payoutData.paymentProvider?.id) {
    base.payoutProcessorId = payoutData.paymentProvider.id;
    base.extras = {
      paymentProviderName: payoutData.paymentProvider.name,
      paymentProviderType: payoutData.paymentProvider.type,
    };
  } else if (payoutData.vendor?.uuid) {
    base.payoutProcessorId = payoutData.vendor.uuid;
    base.extras = {
      vendorName: payoutData.vendor.name,
      location: payoutData.vendor.location,
      contactNumber: payoutData.vendor.phone,
    };
  }

  return base;
}
