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
    { action: 'read', subject: 'FundManagement', inverted: false }, // ❌ NO CREATE
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
 * API: Fetch project-specific permissions for a user
 * Calls: GET /v1/users/{userId}/xrefId/{projectId}/permissions
 */
export async function fetchProjectPermissions(
  userId: string,
  projectId: string,
): Promise<{ data: { permissions: Permission[] } }> {
  try {
    // Get base URL from environment or fallback to localhost
    const baseURL =
      process.env.NEXT_PUBLIC_API_HOST_URL || 'http://localhost:4400';
    const apiUrl = `${baseURL}/v1/users/${userId}/xrefId/${projectId}/permissions`;

    console.log(`[API] Fetching permissions from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies if needed for auth
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.statusText}`);
    }

    const result = await response.json();

    // Map API response to Permission format for CASL
    // Extract only the fields needed: action, subject, inverted, conditions
    const permissions: Permission[] = result.data.map((item: any) => ({
      action: item.action,
      subject: item.subject,
      inverted: item.inverted,
      conditions: item.conditions || undefined,
    }));

    console.log(
      `[API] ✅ Fetched ${permissions.length} permissions for user ${userId} in project ${projectId}`,
      permissions,
    );

    return {
      data: {
        permissions,
      },
    };
  } catch (error) {
    console.error('[API] ❌ Error fetching permissions:', error);

    // Return empty permissions on error to prevent app crash
    // You might want to handle this differently based on your error handling strategy
    return {
      data: {
        permissions: [],
      },
    };
  }
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
