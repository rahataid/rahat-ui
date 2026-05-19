/**
 * Centralized permission constants for type-safe permission checks
 * These map to the subject.action format expected by CASL
 */
export const PERMISSIONS = {
  FUND_MANAGEMENT: {
    CREATE: { action: 'create' as const, subject: 'FundManagement' as const },
    READ: { action: 'read' as const, subject: 'FundManagement' as const },
    UPDATE: { action: 'update' as const, subject: 'FundManagement' as const },
    DELETE: { action: 'delete' as const, subject: 'FundManagement' as const },
  },

  BENEFICIARY: {
    CREATE: { action: 'create' as const, subject: 'Beneficiary' as const },
    READ: { action: 'read' as const, subject: 'Beneficiary' as const },
    UPDATE: { action: 'update' as const, subject: 'Beneficiary' as const },
    DELETE: { action: 'delete' as const, subject: 'Beneficiary' as const },
  },

  VENDOR: {
    CREATE: { action: 'create' as const, subject: 'Vendor' as const },
    READ: { action: 'read' as const, subject: 'Vendor' as const },
    UPDATE: { action: 'update' as const, subject: 'Vendor' as const },
    DELETE: { action: 'delete' as const, subject: 'Vendor' as const },
  },

  TRANSACTION: {
    CREATE: { action: 'create' as const, subject: 'Transaction' as const },
    READ: { action: 'read' as const, subject: 'Transaction' as const },
    UPDATE: { action: 'update' as const, subject: 'Transaction' as const },
    DELETE: { action: 'delete' as const, subject: 'Transaction' as const },
  },

  PROJECT: {
    CREATE: { action: 'create' as const, subject: 'Project' as const },
    READ: { action: 'read' as const, subject: 'Project' as const },
    UPDATE: { action: 'update' as const, subject: 'Project' as const },
    DELETE: { action: 'delete' as const, subject: 'Project' as const },
  },

  USER: {
    CREATE: { action: 'create' as const, subject: 'User' as const },
    READ: { action: 'read' as const, subject: 'User' as const },
    UPDATE: { action: 'update' as const, subject: 'User' as const },
    DELETE: { action: 'delete' as const, subject: 'User' as const },
  },

  ROLE: {
    CREATE: { action: 'create' as const, subject: 'Role' as const },
    READ: { action: 'read' as const, subject: 'Role' as const },
    UPDATE: { action: 'update' as const, subject: 'Role' as const },
    DELETE: { action: 'delete' as const, subject: 'Role' as const },
  },

  SETTINGS: {
    CREATE: { action: 'create' as const, subject: 'Settings' as const },
    READ: { action: 'read' as const, subject: 'Settings' as const },
    UPDATE: { action: 'update' as const, subject: 'Settings' as const },
    DELETE: { action: 'delete' as const, subject: 'Settings' as const },
  },
} as const;
