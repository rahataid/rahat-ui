import { PayoutType } from '@rahat-ui/query';
import { FundWithPayoutSchema } from 'apps/rahat-ui/src/sections/projects/aa-2/payout/initiatePayout/schemas/payout.validation';

export function handleBuildPayoutPayload(
  payoutData: FundWithPayoutSchema | null,
) {
  if (!payoutData?.method || !payoutData.mode) return undefined;

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
