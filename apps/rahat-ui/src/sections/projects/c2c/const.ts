export const mapStatus = (status: string) => {
  switch (status) {
    case 'NEW':
      return 'New';
    case 'UNDER_REVIEW':
      return 'Under Review';
    case 'RESOLVED':
      return 'Resolved';
    case 'CLOSED':
      return 'Closed';
    default:
      return status;
  }
};
