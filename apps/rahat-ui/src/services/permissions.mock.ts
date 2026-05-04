import { Permission } from '../types/permissions';

/**
 * Mock API service for permissions (temporary until backend is ready)
 * This simulates API calls that return fake permission data
 */

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock permission templates for different roles
const mockRolePermissions: Record<string, Permission[]> = {
  // Super Admin role - can do ANYTHING with one wildcard permission! 🔥
  // This is the "bypass everything" role
  superAdmin: [
    { action: 'manage', subject: 'all', inverted: false }, // ✨ MAGIC: One permission = all access
  ],

  // Admin role - has all permissions (explicit way - no longer needed with wildcards!)
  admin: [
    { action: 'create', subject: 'FundManagement', inverted: false },
    { action: 'read', subject: 'FundManagement', inverted: false },
    { action: 'update', subject: 'FundManagement', inverted: false },
    { action: 'delete', subject: 'FundManagement', inverted: false },
    { action: 'create', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'update', subject: 'Beneficiary', inverted: false },
    { action: 'delete', subject: 'Beneficiary', inverted: false },
    { action: 'create', subject: 'Vendor', inverted: false },
    { action: 'read', subject: 'Vendor', inverted: false },
    { action: 'update', subject: 'Vendor', inverted: false },
    { action: 'delete', subject: 'Vendor', inverted: false },
    { action: 'create', subject: 'Transaction', inverted: false },
    { action: 'read', subject: 'Transaction', inverted: false },
    { action: 'create', subject: 'Project', inverted: false },
    { action: 'read', subject: 'Project', inverted: false },
    { action: 'update', subject: 'Project', inverted: false },
  ],

  // Fund Manager - can do EVERYTHING with FundManagement using wildcard
  fundManager: [
    { action: 'manage', subject: 'FundManagement', inverted: false }, // ✨ All FundManagement actions
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Transaction', inverted: false },
    { action: 'read', subject: 'Project', inverted: false },
  ],

  // Manager role - explicit permissions (old way)
  manager: [
    { action: 'create', subject: 'FundManagement', inverted: false },
    { action: 'read', subject: 'FundManagement', inverted: false },
    { action: 'update', subject: 'FundManagement', inverted: false },
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'update', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Vendor', inverted: false },
    { action: 'read', subject: 'Transaction', inverted: false },
    { action: 'read', subject: 'Project', inverted: false },
  ],

  // Fund Manager - can ONLY read funds (no create)
  fundViewer: [
    { action: 'read', subject: 'FundManagement', inverted: false },
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Transaction', inverted: false },
    { action: 'read', subject: 'Project', inverted: false },
  ],

  // Vendor role - limited permissions
  vendor: [
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Transaction', inverted: false },
    { action: 'create', subject: 'Transaction', inverted: false },
  ],

  // Viewer role - read-only
  viewer: [
    { action: 'read', subject: 'FundManagement', inverted: false },
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Vendor', inverted: false },
    { action: 'read', subject: 'Transaction', inverted: false },
    { action: 'read', subject: 'Project', inverted: false },
  ],
};

/**
 * Project-specific permission mapping
 * Maps projectId to permission set
 * This simulates how backend would return different permissions per project
 */
const projectSpecificPermissions: Record<string, Permission[]> = {
  // Project A - User has full fund management permissions
  '73887c41-2d49-445b-85da-f86c65608a23': [
    { action: 'create', subject: 'FundManagement', inverted: false }, // ✅ CAN CREATE
    { action: 'read', subject: 'FundManagement', inverted: false },
    { action: 'update', subject: 'FundManagement', inverted: false },
    { action: 'delete', subject: 'FundManagement', inverted: false },
    { action: 'create', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'update', subject: 'Beneficiary', inverted: false },
  ],

  // Project B - User can only READ funds, no create
  '2ff33d0f-c5cc-4c95-ab3b-77403c9b5d0d': [
    { action: 'manage', subject: 'FundManagement', inverted: false }, // ❌ NO CREATE
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'update', subject: 'Beneficiary', inverted: false },
    { action: 'create', subject: 'Vendor', inverted: false },
    { action: 'read', subject: 'Vendor', inverted: false },
  ],

  // Project C - No fund management access at all
  'project-c': [
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Transaction', inverted: false },
  ],
};

/**
 * Mock API: Fetch project-specific permissions for a user
 * In real implementation, this would be: GET /users/{userId}/projects/{projectId}/permissions
 */
export async function fetchProjectPermissions(
  userId: string,
  projectId: string,
): Promise<{ data: { permissions: Permission[] } }> {
  // Simulate API delay
  await delay(500);

  let permissions: Permission[];

  // FIRST: Check for exact project match (project-specific permissions)
  if (projectSpecificPermissions[projectId]) {
    permissions = projectSpecificPermissions[projectId];
    console.log(
      `[MOCK API] ✅ Project-specific permissions for "${projectId}"`,
      permissions,
    );
  }
  // SECOND: Fall back to role-based patterns (for backward compatibility)
  // Use project ID or user ID to determine role (for testing)
  else if (
    projectId.includes('super-admin') ||
    userId.includes('super-admin')
  ) {
    permissions = mockRolePermissions.superAdmin;
    console.log(
      `[MOCK API] 🔥 Using super admin permissions (manage all) for "${projectId}"`,
      permissions,
    );
  } else if (
    projectId.includes('fund-manager') ||
    userId.includes('fund-manager')
  ) {
    permissions = mockRolePermissions.fundManager;
    console.log(
      `[MOCK API] ✨ Using fund manager permissions (manage FundManagement) for "${projectId}"`,
      permissions,
    );
  } else if (projectId.includes('admin')) {
    permissions = mockRolePermissions.admin;
    console.log(
      `[MOCK API] 📋 Using admin role permissions for "${projectId}"`,
      permissions,
    );
  } else if (projectId.includes('manager')) {
    permissions = mockRolePermissions.manager;
    console.log(
      `[MOCK API] 📋 Using manager role permissions for "${projectId}"`,
      permissions,
    );
  } else if (projectId.includes('vendor')) {
    permissions = mockRolePermissions.vendor;
    console.log(
      `[MOCK API] 📋 Using vendor role permissions for "${projectId}"`,
      permissions,
    );
  } else {
    // Default to viewer permissions
    permissions = mockRolePermissions.viewer;
    console.log(
      `[MOCK API] 📋 Using default viewer permissions for "${projectId}"`,
      permissions,
    );
  }

  return {
    data: {
      permissions,
    },
  };
}

/**
 * Mock API: Fetch global user permissions (for dashboard)
 * In real implementation, this comes from user object or GET /users/me
 */
export async function fetchGlobalPermissions(
  userId: string,
): Promise<{ data: { permissions: Permission[] } }> {
  // Simulate API delay
  await delay(300);

  let permissions: Permission[];

  // Check userId to determine role (for testing wildcards)
  if (userId.includes('super-admin')) {
    permissions = mockRolePermissions.superAdmin;
    console.log(
      `[MOCK API] 🔥 Fetching super admin global permissions (manage all)`,
      permissions,
    );
  } else if (userId.includes('fund-manager')) {
    permissions = mockRolePermissions.fundManager;
    console.log(
      `[MOCK API] ✨ Fetching fund manager global permissions`,
      permissions,
    );
  } else {
    // For demo, return admin permissions globally by default
    // In reality, this comes from the user's global role
    permissions = mockRolePermissions.admin;
    console.log(
      `[MOCK API] Fetching global permissions for user ${userId}`,
      permissions,
    );
  }

  return {
    data: {
      permissions,
    },
  };
}
