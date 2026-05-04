'use client';

import React from 'react';
import { buildAbilityFor, Permission } from '../types/permissions';
import { Auth } from '../components/Auth';
import { useAbility } from '../context/AbilityContext';

/**
 * WILDCARD PERMISSIONS DEMO
 *
 * This example shows how wildcard permissions work without developers
 * needing to write special logic for admin/bypass roles.
 */

// ============================================================================
// DEMO 1: Super Admin - One Permission = Everything
// ============================================================================

function SuperAdminDemo() {
  // Backend returns just ONE permission for super admin
  const superAdminPermissions: Permission[] = [
    { action: 'manage', subject: 'all', inverted: false }, // 🔥 Magic permission
  ];

  const ability = buildAbilityFor(superAdminPermissions);

  // Check various permissions - ALL will be true!
  const checks = [
    { action: 'create', subject: 'FundManagement' },
    { action: 'delete', subject: 'Beneficiary' },
    { action: 'update', subject: 'Vendor' },
    { action: 'read', subject: 'Transaction' },
    { action: 'manage', subject: 'Project' },
  ];

  return (
    <div className="p-6 border rounded-lg bg-purple-50">
      <h3 className="text-xl font-bold mb-4">🔥 Super Admin (manage all)</h3>
      <div className="mb-4">
        <code className="bg-gray-800 text-white p-2 rounded block">
          {JSON.stringify(superAdminPermissions, null, 2)}
        </code>
      </div>
      <div className="space-y-2">
        {checks.map(({ action, subject }) => (
          <div key={`${action}-${subject}`} className="flex items-center gap-2">
            <span className="text-2xl">
              {ability.can(action as any, subject as any) ? '✅' : '❌'}
            </span>
            <code className="text-sm">
              ability.can('{action}', '{subject}')
            </code>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        One permission grants access to EVERYTHING! No special code needed.
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 2: Fund Manager - Manage Specific Resource
// ============================================================================

function FundManagerDemo() {
  // Backend returns manage permission for specific resource
  const fundManagerPermissions: Permission[] = [
    { action: 'manage', subject: 'FundManagement', inverted: false }, // ✨ All FundManagement ops
    { action: 'read', subject: 'Beneficiary', inverted: false },
    { action: 'read', subject: 'Transaction', inverted: false },
  ];

  const ability = buildAbilityFor(fundManagerPermissions);

  const fundManagementChecks = [
    { action: 'create', subject: 'FundManagement', expected: true },
    { action: 'read', subject: 'FundManagement', expected: true },
    { action: 'update', subject: 'FundManagement', expected: true },
    { action: 'delete', subject: 'FundManagement', expected: true },
  ];

  const otherChecks = [
    { action: 'create', subject: 'Beneficiary', expected: false },
    { action: 'update', subject: 'Beneficiary', expected: false },
    { action: 'read', subject: 'Beneficiary', expected: true },
  ];

  return (
    <div className="p-6 border rounded-lg bg-blue-50">
      <h3 className="text-xl font-bold mb-4">
        ✨ Fund Manager (manage FundManagement)
      </h3>
      <div className="mb-4">
        <code className="bg-gray-800 text-white p-2 rounded block text-xs">
          {JSON.stringify(fundManagerPermissions, null, 2)}
        </code>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">FundManagement Operations:</h4>
        <div className="space-y-1">
          {fundManagementChecks.map(({ action, subject, expected }) => (
            <div
              key={`${action}-${subject}`}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">
                {ability.can(action as any, subject as any) === expected
                  ? '✅'
                  : '❌'}
              </span>
              <code className="text-sm">
                ability.can('{action}', '{subject}') = {expected.toString()}
              </code>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Other Resources:</h4>
        <div className="space-y-1">
          {otherChecks.map(({ action, subject, expected }) => (
            <div
              key={`${action}-${subject}`}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">
                {ability.can(action as any, subject as any) === expected
                  ? '✅'
                  : '❌'}
              </span>
              <code className="text-sm">
                ability.can('{action}', '{subject}') = {expected.toString()}
              </code>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        'manage' on FundManagement = all actions on FundManagement only!
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 3: Viewer - Read Everything
// ============================================================================

function ViewerDemo() {
  // Backend returns read permission for all resources
  const viewerPermissions: Permission[] = [
    { action: 'read', subject: 'all', inverted: false }, // 👁️ Read-only everything
  ];

  const ability = buildAbilityFor(viewerPermissions);

  const readChecks = [
    { action: 'read', subject: 'FundManagement', expected: true },
    { action: 'read', subject: 'Beneficiary', expected: true },
    { action: 'read', subject: 'Vendor', expected: true },
    { action: 'read', subject: 'Transaction', expected: true },
  ];

  const writeChecks = [
    { action: 'create', subject: 'FundManagement', expected: false },
    { action: 'update', subject: 'Beneficiary', expected: false },
    { action: 'delete', subject: 'Vendor', expected: false },
  ];

  return (
    <div className="p-6 border rounded-lg bg-green-50">
      <h3 className="text-xl font-bold mb-4">👁️ Viewer (read all)</h3>
      <div className="mb-4">
        <code className="bg-gray-800 text-white p-2 rounded block">
          {JSON.stringify(viewerPermissions, null, 2)}
        </code>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Can Read Everything:</h4>
        <div className="space-y-1">
          {readChecks.map(({ action, subject, expected }) => (
            <div
              key={`${action}-${subject}`}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">
                {ability.can(action as any, subject as any) === expected
                  ? '✅'
                  : '❌'}
              </span>
              <code className="text-sm">
                ability.can('{action}', '{subject}') = {expected.toString()}
              </code>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Cannot Modify Anything:</h4>
        <div className="space-y-1">
          {writeChecks.map(({ action, subject, expected }) => (
            <div
              key={`${action}-${subject}`}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">
                {ability.can(action as any, subject as any) === expected
                  ? '✅'
                  : '❌'}
              </span>
              <code className="text-sm">
                ability.can('{action}', '{subject}') = {expected.toString()}
              </code>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        'read' on 'all' = read any resource, but no write operations!
      </p>
    </div>
  );
}

// ============================================================================
// DEMO 4: Real-World Component Usage
// ============================================================================

function FundManagementButtons() {
  const ability = useAbility();

  // ✅ CORRECT: Just check for the specific permission you need
  // CASL automatically handles wildcards:
  // - If user has 'manage' on 'FundManagement' → all checks pass
  // - If user has 'manage' on 'all' → all checks pass
  // - If user has explicit permission → that specific check passes

  return (
    <div className="p-6 border rounded-lg bg-yellow-50">
      <h3 className="text-xl font-bold mb-4">💻 Real Component Usage</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm mb-2">
            <strong>Developer writes simple checks:</strong>
          </p>
          <code className="bg-gray-800 text-white p-3 rounded block text-sm mb-4">
            {`const canCreate = ability.can('create', 'FundManagement');
const canUpdate = ability.can('update', 'FundManagement');
const canDelete = ability.can('delete', 'FundManagement');`}
          </code>
        </div>

        <div>
          <p className="text-sm mb-2">
            <strong>Conditional rendering (no special admin checks!):</strong>
          </p>
          <div className="flex gap-2">
            <Auth I="create" a="FundManagement">
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                ➕ Create Fund
              </button>
            </Auth>

            <Auth I="update" a="FundManagement">
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                ✏️ Update
              </button>
            </Auth>

            <Auth I="delete" a="FundManagement">
              <button className="px-4 py-2 bg-red-500 text-white rounded">
                🗑️ Delete
              </button>
            </Auth>
          </div>
        </div>

        <div className="bg-white p-4 rounded border-l-4 border-yellow-500">
          <p className="text-sm">
            <strong>🎯 Key Point:</strong> The developer doesn't need to check
            if the user is an admin or has <code>manage</code> permission!
          </p>
          <p className="text-sm mt-2">CASL automatically knows that:</p>
          <ul className="text-sm list-disc ml-6 mt-2">
            <li>
              <code>manage FundManagement</code> → allows create/update/delete
            </li>
            <li>
              <code>manage all</code> → allows everything
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEMO 5: What NOT to Do (Anti-patterns)
// ============================================================================

function AntiPatternsDemo() {
  const ability = useAbility();

  return (
    <div className="p-6 border rounded-lg bg-red-50">
      <h3 className="text-xl font-bold mb-4 text-red-700">
        ❌ Anti-patterns (Don't Do This!)
      </h3>

      <div className="space-y-4">
        <div>
          <p className="font-semibold text-red-600 mb-2">
            ❌ BAD: Checking for 'manage' explicitly
          </p>
          <code className="bg-gray-800 text-white p-3 rounded block text-sm">
            {`// ❌ Don't do this:
if (ability.can('manage', 'FundManagement') || 
    ability.can('create', 'FundManagement')) {
  // Show button
}

// ✅ Do this instead:
if (ability.can('create', 'FundManagement')) {
  // CASL checks 'manage' for you!
}`}
          </code>
        </div>

        <div>
          <p className="font-semibold text-red-600 mb-2">
            ❌ BAD: Mixing role-based and permission-based checks
          </p>
          <code className="bg-gray-800 text-white p-3 rounded block text-sm">
            {`// ❌ Don't do this:
if (user.role === 'admin' || 
    ability.can('create', 'FundManagement')) {
  // Show button
}

// ✅ Do this instead:
if (ability.can('create', 'FundManagement')) {
  // Admin will have 'manage all' permission from backend
}`}
          </code>
        </div>

        <div>
          <p className="font-semibold text-red-600 mb-2">
            ❌ BAD: Using RoleAuth AND Auth together
          </p>
          <code className="bg-gray-800 text-white p-3 rounded block text-sm">
            {`// ❌ Don't do this:
<RoleAuth roles={['ADMIN', 'MANAGER']}>
  <Auth I="create" a="FundManagement">
    <Button />
  </Auth>
</RoleAuth>

// ✅ Do this instead:
<Auth I="create" a="FundManagement">
  <Button />  {/* Backend gives admins 'manage all' */}
</Auth>`}
          </code>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Export
// ============================================================================

export default function WildcardPermissionsExample() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          🎯 Wildcard Permissions Demo
        </h1>
        <p className="text-gray-600">
          How to create bypass roles without special code
        </p>
      </div>

      <SuperAdminDemo />
      <FundManagerDemo />
      <ViewerDemo />
      <FundManagementButtons />
      <AntiPatternsDemo />

      <div className="p-6 border rounded-lg bg-blue-50 border-blue-300">
        <h3 className="text-xl font-bold mb-4">📚 Summary</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <strong>Backend grants wildcards:</strong>
              <code className="ml-2 bg-white px-2 py-1 rounded">
                {'{ action: "manage", subject: "all" }'}
              </code>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <strong>Frontend checks specific permissions:</strong>
              <code className="ml-2 bg-white px-2 py-1 rounded">
                ability.can('create', 'FundManagement')
              </code>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <strong>CASL automatically resolves wildcards</strong> - no
              special code needed!
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-2xl">🎉</span>
            <div>
              <strong>Result:</strong> One permission can grant universal access
              without developers writing admin checks everywhere!
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
