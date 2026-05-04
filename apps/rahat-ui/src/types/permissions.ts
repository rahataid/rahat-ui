import { AbilityBuilder, PureAbility, AbilityClass } from '@casl/ability';

// Define your actions
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

// Define your subjects (resources) - subject to change based on requirements
export type Subject =
  | 'FundManagement'
  | 'Beneficiary'
  | 'Vendor'
  | 'Transaction'
  | 'Project'
  | 'User'
  | 'Role'
  | 'Settings'
  | 'all'; // 'all' means all subjects

// Permission from backend
export interface Permission {
  action: string;
  subject: string;
  inverted: boolean;
  conditions?: any;
}

// Define the ability type
export type AppAbility = PureAbility<[Action, Subject]>;

// Create the Ability class
export const AppAbility = PureAbility as AbilityClass<AppAbility>;

/**
 * Helper to build CASL abilities from backend permissions
 * @param permissions - Array of permissions from backend
 * @returns AppAbility instance for CASL
 */
export function buildAbilityFor(permissions: Permission[]): AppAbility {
  const { can, cannot, build } = new AbilityBuilder(AppAbility);

  permissions.forEach((permission) => {
    const action = permission.action as Action;
    const subject = permission.subject as Subject;

    if (permission.inverted) {
      // Use 'cannot' for inverted permissions
      cannot(action, subject, permission.conditions);
    } else {
      // Use 'can' for allowed permissions
      can(action, subject, permission.conditions);
    }
  });

  return build();
}
