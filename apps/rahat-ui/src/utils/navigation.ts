// utils/getBeneficiaryRedirectRoute.ts
export const getBeneficiaryRedirectRoute = (
  projectId: string,
  options: {
    redirectTo?: string | null;
    redirectToFund?: string | null;
    vendorId?: string | null;
    tab?: string | null;
    subTab?: string | null;
    perPage?: string | null;
    page?: string | null;
  },
): string => {
  const { redirectTo, redirectToFund, vendorId, tab, subTab, perPage, page } =
    options;

  if (redirectTo) {
    return `/projects/aa/${projectId}/beneficiary/groupDetails/${redirectTo}`;
  }

  if (redirectToFund) {
    return `/projects/aa/${projectId}/fund-management/${redirectToFund}`;
  }

  if (vendorId) {
    return `/projects/aa/${projectId}/vendors/${vendorId}?tab=${tab}&subTab=${subTab}&perPage=${perPage}&page=${page}`;
  }

  return `/projects/aa/${projectId}/beneficiary`;
};
