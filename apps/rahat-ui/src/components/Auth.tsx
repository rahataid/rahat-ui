'use client';

import React from 'react';
import { useAbility, useAbilityContext } from '../context/AbilityContext.old';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ShieldX, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Action, Subject } from '../types/permissions';

export interface AuthProps {
  I: Action; // The action (create, read, update, delete)
  a: Subject; // The subject/resource (FundManagement, Beneficiary, etc.)
  passThrough?: boolean; // If true, renders children even without permission but passes 'allowed' prop
  fallback?: React.ReactNode; // Custom fallback content
  showDenied?: boolean; // Show access denied message
  loadingComponent?: React.ReactNode; // Custom loading component
  children: React.ReactNode | ((allowed: boolean) => React.ReactNode);
}

/**
 * Auth Component - Permission-based content guard using CASL
 *
 * @example
 * // Hide button if no permission
 * <Auth I="create" a="FundManagement">
 *   <CreateButton />
 * </Auth>
 *
 * @example
 * // Show loading skeleton while fetching permissions
 * <Auth I="read" a="Beneficiary" loadingComponent={<Skeleton />}>
 *   <BeneficiaryList />
 * </Auth>
 *
 * @example
 * // Conditional rendering based on permission
 * <Auth I="update" a="Vendor" passThrough>
 *   {(allowed) => (
 *     <Button disabled={!allowed}>
 *       {allowed ? 'Edit' : 'View Only'}
 *     </Button>
 *   )}
 * </Auth>
 */
export function Auth({
  I: action,
  a: subject,
  passThrough = false,
  fallback = null,
  showDenied = false,
  loadingComponent = null,
  children,
}: AuthProps) {
  const ability = useAbility();
  const { loading } = useAbilityContext();
  const router = useRouter();

  // Show loading state
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    // Default loading indicator
    return passThrough ? (
      typeof children === 'function' ? (
        children(false)
      ) : (
        <>{children}</>
      )
    ) : null;
  }

  console.log(
    `[Auth] Checking permission for action="${action}" on subject="${subject}"`,
  );

  // Check if user has permission
  const allowed = ability.can(action, subject);

  // If passThrough mode, always render but pass allowed state
  if (passThrough) {
    return typeof children === 'function' ? children(allowed) : <>{children}</>;
  }

  // If not allowed
  if (!allowed) {
    // Show custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    console.warn(
      `[Auth] Access denied for action="${action}" on subject="${subject}"`,
    );
    // Show access denied message
    if (showDenied) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 border border-border">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <ShieldX className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>

              <h3 className="text-2xl font-bold text-red-600">Access Denied</h3>

              <p className="text-muted-foreground">
                You don't have permission to access this feature. Please contact
                your administrator for access.
              </p>

              <Button
                onClick={() => router.back()}
                className="bg-gradient-to-r bg-blue-500 hover:bg-blue-600 text-white"
              >
                Return Back
              </Button>
            </div>
          </div>
        </div>
      );
    }

    console.warn(
      `[Auth] Access denied for action="${action}" on subject="${subject}"`,
    );

    // Default: just hide
    return null;
  }

  // User has permission
  return typeof children === 'function' ? children(allowed) : <>{children}</>;
}

export default Auth;
