export const getBeneficiaryRedirectRoute = (
  projectId: string,
  options: {
    redirectTo?: string | null;
    redirectToFund?: string | null;
    vendorId?: string | null;
    tab?: string | null;
    subTab?: string | null;
    pagination?: string | null;
  },
): string => {
  const { redirectTo, redirectToFund, vendorId, tab, subTab, pagination } =
    options;

  if (redirectTo) {
    return `/projects/aa/${projectId}/beneficiary/groupDetails/${redirectTo}`;
  }

  if (redirectToFund) {
    return `/projects/aa/${projectId}/fund-management/${redirectToFund}`;
  }

  if (vendorId) {
    return `/projects/aa/${projectId}/vendors/${vendorId}?tab=${tab}&subTab=${subTab}&isBackFromBeneficiaryDetail=true#pagination=${encodeURIComponent(
      JSON.stringify(pagination),
    )}`;
  }

  return `/projects/aa/${projectId}/beneficiary`;
};

export const getVendorRedirectRoute = (
  projectId: string,
  options: {
    pagination?: string | null;
  },
): string => {
  return `/projects/aa/${projectId}/vendors?isBackFromVendorDetail=true#pagination=${encodeURIComponent(
    JSON.stringify(options?.pagination),
  )}`;
};
