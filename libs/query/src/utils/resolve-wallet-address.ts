/**
 * Resolve the wallet address for the chain of the project being viewed.
 *
 * Entities such as beneficiaries and vendors can carry multiple addresses in
 * `walletAddressDetails`. Only the entry whose `chainType` matches the
 * current project chain should be used; the global `walletAddress` /
 * `wallet` field is the fallback.
 */
export const resolveWalletAddress = (
  entity: any,
  chainType?: string | null,
): string | undefined => {
  const details = entity?.walletAddressDetails;
  if (Array.isArray(details) && chainType) {
    const match = details.find(
      (d: any) =>
        String(d?.chainType || '').toLowerCase() ===
        String(chainType).toLowerCase(),
    );
    if (match?.address) return match.address;
  }
  return entity?.walletAddress ?? entity?.wallet ?? undefined;
};
