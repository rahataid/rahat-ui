const ROOTS = {
  DASHBOARD: "/dashboard",
  BENEFICIARY: "/beneficiaries",
  USER: "/users",
  PROJECT: "/projects",
  TRANSACTION: "/transactions",
  REPORTING: "reporting",
};

export const paths = {
  dashboard: {
    root: ROOTS.DASHBOARD,
    general: {
      beneficiary: ROOTS.BENEFICIARY,
      user: ROOTS.USER,
      project: ROOTS.PROJECT,
      transaction: ROOTS.TRANSACTION,
      reporting: ROOTS.REPORTING,
    },
  },
};
