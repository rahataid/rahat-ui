# CASL Permission System Implementation

## 📋 Overview

This implementation provides a **granular, project-specific permission system** using **CASL (Pronounced "castle")** - an isomorphic authorization JavaScript library.

### Key Features

- ✅ **Project-specific permissions**: Different permissions per project
- ✅ **Automatic caching**: 15-minute TTL with auto-refresh
- ✅ **Multiple project support**: Cached permissions for recently accessed projects
- ✅ **Dashboard fallback**: Uses global permissions when no project selected
- ✅ **Mock API**: Frontend mock data ready (backend endpoint to be implemented)
- ✅ **Type-safe**: Full TypeScript support
- ✅ **React Query integration**: Auto-refetch, retry, and caching

---

## 📁 File Structure

```
apps/rahat-ui/src/
├── types/
│   └── permissions.ts              # CASL types & ability builder
├── constants/
│   └── permissions.ts              # Permission constants (optional)
├── store/
│   └── permissions.store.ts        # Zustand store with TTL
├── services/
│   └── permissions.mock.ts         # Mock API (temporary)
├── hooks/
│   └── usePermissions.ts           # React Query hooks
├── context/
│   └── AbilityContext.tsx          # CASL context provider
├── components/
│   └── Auth.tsx                    # Permission guard component
└── examples/
    └── permission-usage.examples.tsx  # Usage examples
```

---

## 🚀 Setup Instructions

### Step 1: Wrap Your App with AbilityProvider

In your main layout or provider file, wrap your app:

```tsx
// apps/rahat-ui/src/app/layout.tsx
import { AbilityProvider } from '../context/AbilityContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Other providers (RSQueryProvider, etc.) */}
        <AbilityProvider>{children}</AbilityProvider>
      </body>
    </html>
  );
}
```

### Step 2: Start Using Permissions

That's it! Now you can use the permission system throughout your app.

---

## 📖 Usage Guide

### **Option 1: Using `<Auth>` Component (Recommended)**

```tsx
import { Auth } from '@/components/Auth';

// Simple permission check
<Auth I="create" a="FundManagement">
  <CreateFundButton />
</Auth>

// With loading state
<Auth I="read" a="Beneficiary" loadingComponent={<Skeleton />}>
  <BeneficiaryList />
</Auth>

// Full page protection with access denied message
<Auth I="read" a="FundManagement" showDenied={true}>
  <FundManagementPage />
</Auth>

// Conditional rendering based on permission
<Auth I="update" a="Vendor" passThrough>
  {(allowed) => (
    <Button disabled={!allowed}>
      {allowed ? 'Edit Vendor' : 'View Only'}
    </Button>
  )}
</Auth>
```

### **Option 2: Using CASL's `<Can>` Component**

```tsx
import { Can } from '@/context/AbilityContext';

<Can I="create" a="Beneficiary">
  <CreateButton />
</Can>

<Can I="delete" a="Vendor">
  <DeleteButton />
</Can>
```

### **Option 3: Using `useAbility` Hook (Programmatic)**

```tsx
import { useAbility } from '@/context/AbilityContext';

function MyComponent() {
  const ability = useAbility();

  const canCreate = ability.can('create', 'FundManagement');
  const canUpdate = ability.can('update', 'FundManagement');

  return (
    <div>
      {canCreate && <CreateButton />}
      {canUpdate && <EditButton />}
    </div>
  );
}
```

### **Option 4: Using Permission Constants (Type-safe)**

```tsx
import { Auth } from '@/components/Auth';
import { PERMISSIONS } from '@/constants/permissions';

const { action, subject } = PERMISSIONS.FUND_MANAGEMENT.CREATE;

<Auth I={action} a={subject}>
  <CreateButton />
</Auth>;
```

---

## 🔄 How It Works

### **Flow Diagram**

```
User Logs In
    ↓
User Selects Project
    ↓
useProjectStore.setSingleProject(project)
    ↓
AbilityContext detects project change
    ↓
Checks Zustand store for cached permissions
    ↓
    ├─→ Found & Fresh (< 15 min) → Use cached permissions
    │
    └─→ Not found or Stale (> 15 min)
        ↓
        useProjectPermissions() hook triggered
        ↓
        Mock API: fetchProjectPermissions(userId, projectId)
        ↓
        Response: { permissions: [...] }
        ↓
        Cache in Zustand store with timestamp
        ↓
        buildAbilityFor(permissions) → CASL instance
        ↓
<Auth /> and <Can /> check permissions
    ↓
Show/Hide components based on permissions
```

### **Auto-Refresh Every 15 Minutes**

React Query automatically refetches permissions every 15 minutes in the background. No manual intervention needed!

---

## 🎛️ Backend Integration (To Be Implemented)

### **Required Endpoint**

Your backend needs to provide this endpoint:

```
GET /users/{userId}/projects/{projectId}/permissions
```

**Response Format:**

```json
{
  "data": {
    "permissions": [
      {
        "action": "create",
        "subject": "fund_management",
        "inverted": false,
        "conditions": null
      },
      {
        "action": "read",
        "subject": "beneficiary",
        "inverted": false,
        "conditions": null
      }
    ]
  }
}
```

### **Alternative: Global Endpoint with Query Param**

```
GET /users/me?projectId={projectId}
```

**Response:**

```json
{
  "user": {
    "id": 123,
    "name": "John Doe",
    "permissions": [
      { "action": "create", "subject": "fund_management", "inverted": false }
    ]
  }
}
```

### **How to Connect Real Backend**

When backend is ready, update this file:

**File**: `apps/rahat-ui/src/services/permissions.mock.ts`

Replace mock functions with real API calls:

```typescript
// Before (Mock)
export async function fetchProjectPermissions(
  userId: string,
  projectId: string,
) {
  await delay(500);
  return { data: { permissions: mockPermissions.admin } };
}

// After (Real API)
export async function fetchProjectPermissions(
  userId: string,
  projectId: string,
) {
  const response = await fetch(
    `/api/users/${userId}/projects/${projectId}/permissions`,
  );
  return response.json();
}
```

Or use your existing API client:

```typescript
import { useRSQuery } from '@rumsan/react-query';

export async function fetchProjectPermissions(
  userId: string,
  projectId: string,
) {
  const { rumsanService } = useRSQuery();
  return rumsanService.client.get(
    `/users/${userId}/projects/${projectId}/permissions`,
  );
}
```

---

## 🧪 Testing with Mock Data

The mock API returns different permissions based on projectId patterns:

```typescript
// Mock patterns in permissions.mock.ts
projectId.includes('admin')   → Full admin permissions
projectId.includes('manager') → Manager permissions (no delete)
projectId.includes('vendor')  → Vendor permissions (limited)
default                       → Viewer permissions (read-only)
```

**Testing Tips:**

1. Create test projects with names like "admin-project", "manager-project"
2. Switch between projects and watch console logs
3. Permissions will auto-refresh after 15 minutes
4. Check browser DevTools → Console for permission logs

---

## 📝 Available Permissions

### **Actions**

- `create` - Create new resources
- `read` - View/read resources
- `update` - Edit/update resources
- `delete` - Delete resources
- `manage` - Full control (all actions)

### **Subjects (Resources)**

- `FundManagement`
- `Beneficiary`
- `Vendor`
- `Transaction`
- `Project`
- `User`
- `Role`
- `Settings`

**Note**: Subjects can be added/modified in `apps/rahat-ui/src/types/permissions.ts`

---

## 🔧 Configuration

### **Change TTL Duration**

Edit: `apps/rahat-ui/src/store/permissions.store.ts`

```typescript
// Change from 15 minutes to 30 minutes
const PERMISSIONS_TTL = 30 * 60 * 1000;
```

### **Change Refetch Interval**

Edit: `apps/rahat-ui/src/hooks/usePermissions.ts`

```typescript
export function useProjectPermissions(...) {
  return useQuery({
    // Change auto-refetch interval
    refetchInterval: 30 * 60 * 1000, // 30 minutes
    staleTime: 30 * 60 * 1000,
    ...
  });
}
```

---

## 🐛 Debugging

### **Enable Console Logs**

The AbilityContext already logs permission events:

```
[AbilityContext] Using cached project permissions
[AbilityContext] Caching new project permissions
[AbilityContext] Project permissions are stale, refetching...
[MOCK API] Fetching permissions for user 123 in project abc
```

### **Check Zustand Store**

Install Zustand DevTools in browser, then:

```typescript
// Store is already configured with devtools
export const usePermissionsStore = create<PermissionsState>((...) => ({...}), {
  devtoolsEnabled: true,
});
```

### **Manually Refresh Permissions**

```typescript
import { useAbilityContext } from '@/context/AbilityContext';

function MyComponent() {
  const { updateAbility } = useAbilityContext();

  return <button onClick={updateAbility}>Refresh Permissions</button>;
}
```

---

## 📚 Additional Resources

- **CASL Documentation**: https://casl.js.org/v6/en/
- **React Query Docs**: https://tanstack.com/query/latest
- **Zustand Docs**: https://github.com/pmndrs/zustand

---

## ✅ Migration from Old System

### **Before (Role-based)**

```tsx
<RoleAuth roles={[AARoles.MANAGER, AARoles.ADMIN]}>
  <FundManagementButton />
</RoleAuth>
```

### **After (Permission-based)**

```tsx
<Auth I="create" a="FundManagement">
  <FundManagementButton />
</Auth>
```

### **Why This is Better**

- ✅ Any custom role can have any permission
- ✅ Project-specific permissions
- ✅ Managed from backend (no frontend code changes)
- ✅ More granular control
- ✅ Field-level permissions possible (future enhancement)

---

## 🎯 Next Steps

1. ✅ Implementation complete with mock data
2. ⏳ Backend team implements permission endpoint
3. ⏳ Replace mock service with real API calls
4. ⏳ Start migrating `<RoleAuth>` to `<Auth>` throughout the app
5. ⏳ Add more subjects/resources as needed

---

## 💡 Tips & Best Practices

1. **Use constants** for type safety: `PERMISSIONS.FUND_MANAGEMENT.CREATE`
2. **Cache benefits**: Switching between recently visited projects is instant
3. **Loading states**: Always handle loading for better UX
4. **Fallback**: The system falls back to user's global permissions if project permissions fail
5. **Console logs**: Check browser console to understand permission flow

---

## 🤝 Contributing

When adding new resources:

1. Add to `Subject` type in `types/permissions.ts`
2. Add to `PERMISSIONS` constant in `constants/permissions.ts`
3. Update mock data in `services/permissions.mock.ts`
4. Backend team adds the resource to their permission system

---

**Implementation Date**: May 4, 2026  
**Status**: ✅ Ready for testing with mock data  
**Backend Integration**: ⏳ Pending

----------

// Backend implementation
# 📡 Backend API Contract - Permission System

## Overview

This document describes the exact API contract between frontend and backend for the CASL permission system.

---

## 🔄 API Endpoints

### 1. Get Project-Specific Permissions

**Endpoint**: `GET /users/{userId}/projects/{projectId}/permissions`

**When Called**: 
- User selects a project
- Every 15 minutes (auto-refetch)
- Manual refresh via `updateAbility()`

**Frontend Request**:
```typescript
// React Query automatically calls this:
GET /users/550e8400-e29b-41d4-a716-446655440000/projects/73887c41-2d49-445b-85da-f86c65608a23/permissions

// Headers:
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**No request body needed** - everything is in the URL path.

---

### 2. Get Global Permissions (Dashboard)

**Endpoint**: `GET /users/{userId}/permissions`

**When Called**:
- User is on dashboard (no project selected)
- Every 15 minutes (auto-refetch)
- Manual refresh via `updateAbility()`

**Frontend Request**:
```typescript
GET /users/550e8400-e29b-41d4-a716-446655440000/permissions

// Headers:
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**No request body needed** - userId is in the URL path.

---

## 📥 Backend Response Format

### Response Structure

Both endpoints return the **same structure**:

```typescript
{
  "data": {
    "permissions": [
      {
        "action": "create" | "read" | "update" | "delete" | "manage",
        "subject": "FundManagement" | "Beneficiary" | "Vendor" | "Transaction" | "Project" | "User" | "Role" | "Settings" | "all",
        "inverted": false,
        "conditions": {} | null  // Optional - for advanced rules
      }
    ]
  }
}
```

### TypeScript Interface

```typescript
interface Permission {
  action: string;        // 'create' | 'read' | 'update' | 'delete' | 'manage'
  subject: string;       // 'FundManagement' | 'Beneficiary' | 'Vendor' | etc. | 'all'
  inverted: boolean;     // false = allow, true = deny (for 'cannot' rules)
  conditions?: any;      // Optional - for field-level permissions
}

interface PermissionsResponse {
  data: {
    permissions: Permission[];
  }
}
```

---

## 📤 Real Response Examples

### Example 1: Super Admin (Bypass Everything)

```json
{
  "data": {
    "permissions": [
      {
        "action": "manage",
        "subject": "all",
        "inverted": false
      }
    ]
  }
}
```

**Result**: User can do ANYTHING! Just 1 permission grants universal access.

---

### Example 2: Fund Manager (Resource-Specific Bypass)

```json
{
  "data": {
    "permissions": [
      {
        "action": "manage",
        "subject": "FundManagement",
        "inverted": false
      },
      {
        "action": "read",
        "subject": "Beneficiary",
        "inverted": false
      },
      {
        "action": "read",
        "subject": "Transaction",
        "inverted": false
      }
    ]
  }
}
```

**Result**: Full control over FundManagement, read-only for others.

---

### Example 3: Project Manager (Explicit Permissions)

```json
{
  "data": {
    "permissions": [
      {
        "action": "create",
        "subject": "FundManagement",
        "inverted": false
      },
      {
        "action": "read",
        "subject": "FundManagement",
        "inverted": false
      },
      {
        "action": "update",
        "subject": "FundManagement",
        "inverted": false
      },
      {
        "action": "read",
        "subject": "Beneficiary",
        "inverted": false
      },
      {
        "action": "update",
        "subject": "Beneficiary",
        "inverted": false
      },
      {
        "action": "read",
        "subject": "Vendor",
        "inverted": false
      }
    ]
  }
}
```

**Result**: Granular permissions for specific operations.

---

### Example 4: Viewer (Read-Only Everything)

```json
{
  "data": {
    "permissions": [
      {
        "action": "read",
        "subject": "all",
        "inverted": false
      }
    ]
  }
}
```

**Result**: Can read ANY resource but cannot modify anything.

---

### Example 5: Vendor (Limited Access)

```json
{
  "data": {
    "permissions": [
      {
        "action": "read",
        "subject": "Beneficiary",
        "inverted": false
      },
      {
        "action": "read",
        "subject": "Transaction",
        "inverted": false
      },
      {
        "action": "create",
        "subject": "Transaction",
        "inverted": false
      }
    ]
  }
}
```

**Result**: Can only view beneficiaries/transactions and create new transactions.

---

### Example 6: With Conditions (Advanced)

```json
{
  "data": {
    "permissions": [
      {
        "action": "update",
        "subject": "Beneficiary",
        "inverted": false,
        "conditions": {
          "assignedTo": "${userId}"
        }
      },
      {
        "action": "read",
        "subject": "Beneficiary",
        "inverted": false
      }
    ]
  }
}
```

**Result**: Can read all beneficiaries, but can only update ones assigned to them.

---

## 🚫 Deny Permissions (Inverted)

You can also explicitly deny permissions using `inverted: true`:

```json
{
  "data": {
    "permissions": [
      {
        "action": "read",
        "subject": "all",
        "inverted": false
      },
      {
        "action": "delete",
        "subject": "FundManagement",
        "inverted": true
      }
    ]
  }
}
```

**Result**: Can read everything, but **explicitly cannot** delete funds (even if they're admin).

---

## 💻 Frontend Implementation

### How Frontend Calls API

```typescript
// In hooks/usePermissions.ts
export function useProjectPermissions(userId: string, projectId: string) {
  return useQuery({
    queryKey: ['permissions', 'project', userId, projectId],
    queryFn: () => fetchProjectPermissions(userId, projectId),
    staleTime: 15 * 60 * 1000,      // 15 minutes
    refetchInterval: 15 * 60 * 1000, // Auto-refetch every 15 min
  });
}
```

### What Frontend Sends (Using Axios Example)

```typescript
// In services/permissions.service.ts (replace mock)
import axios from 'axios';

export async function fetchProjectPermissions(
  userId: string, 
  projectId: string
): Promise<{ data: { permissions: Permission[] } }> {
  const response = await axios.get(
    `/users/${userId}/projects/${projectId}/permissions`,
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      }
    }
  );
  
  return response.data;
}

export async function fetchGlobalPermissions(
  userId: string
): Promise<{ data: { permissions: Permission[] } }> {
  const response = await axios.get(
    `/users/${userId}/permissions`,
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      }
    }
  );
  
  return response.data;
}
```

---

## 🏗️ Backend Implementation Guide

### Simple Implementation (Role-Based)

```typescript
// Example: Express.js
app.get('/users/:userId/projects/:projectId/permissions', async (req, res) => {
  const { userId, projectId } = req.params;
  
  // Get user's role in this project
  const userRole = await getUserRoleInProject(userId, projectId);
  
  let permissions: Permission[] = [];
  
  switch (userRole) {
    case 'SUPER_ADMIN':
      permissions = [
        { action: 'manage', subject: 'all', inverted: false }
      ];
      break;
      
    case 'FUND_MANAGER':
      permissions = [
        { action: 'manage', subject: 'FundManagement', inverted: false },
        { action: 'read', subject: 'Beneficiary', inverted: false },
        { action: 'read', subject: 'Transaction', inverted: false }
      ];
      break;
      
    case 'MANAGER':
      permissions = [
        { action: 'create', subject: 'FundManagement', inverted: false },
        { action: 'read', subject: 'FundManagement', inverted: false },
        { action: 'update', subject: 'FundManagement', inverted: false },
        { action: 'read', subject: 'Beneficiary', inverted: false },
        { action: 'update', subject: 'Beneficiary', inverted: false }
      ];
      break;
      
    case 'VIEWER':
      permissions = [
        { action: 'read', subject: 'all', inverted: false }
      ];
      break;
      
    default:
      permissions = [];
  }
  
  res.json({
    data: {
      permissions
    }
  });
});
```

---

### Advanced Implementation (Database-Driven)

```typescript
// Database schema:
// permissions table:
//   user_id, project_id, action, subject, inverted, conditions

app.get('/users/:userId/projects/:projectId/permissions', async (req, res) => {
  const { userId, projectId } = req.params;
  
  // Query permissions from database
  const permissions = await db.query(`
    SELECT action, subject, inverted, conditions
    FROM user_project_permissions
    WHERE user_id = $1 AND project_id = $2
  `, [userId, projectId]);
  
  res.json({
    data: {
      permissions: permissions.rows
    }
  });
});
```

---

### Hybrid Approach (Recommended)

```typescript
app.get('/users/:userId/projects/:projectId/permissions', async (req, res) => {
  const { userId, projectId } = req.params;
  
  // Check if user has a role that grants wildcard permissions
  const userRole = await getUserRoleInProject(userId, projectId);
  
  if (userRole === 'SUPER_ADMIN') {
    // Bypass: return wildcard
    return res.json({
      data: {
        permissions: [{ action: 'manage', subject: 'all', inverted: false }]
      }
    });
  }
  
  if (userRole === 'FUND_MANAGER') {
    // Partial bypass
    return res.json({
      data: {
        permissions: [
          { action: 'manage', subject: 'FundManagement', inverted: false },
          { action: 'read', subject: 'Beneficiary', inverted: false }
        ]
      }
    });
  }
  
  // Otherwise, get granular permissions from database
  const permissions = await getExplicitPermissions(userId, projectId);
  
  res.json({
    data: {
      permissions
    }
  });
});
```

---

## 🔐 Authentication & Authorization

### Frontend Authentication

```typescript
// Frontend stores JWT token (from login)
const token = localStorage.getItem('auth_token');

// All API calls include token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Backend Validation

```typescript
app.get('/users/:userId/projects/:projectId/permissions', 
  authenticateJWT,  // Middleware to verify JWT
  async (req, res) => {
    const { userId } = req.params;
    
    // Verify the requesting user is authorized to see these permissions
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // ... return permissions
  }
);
```

---

## ⚡ Performance Considerations

### Caching Strategy

**Frontend**:
- React Query cache: 15 minutes
- Zustand store cache: 15 minutes with timestamp
- Auto-refetch in background every 15 minutes

**Backend** (Optional):
```typescript
import NodeCache from 'node-cache';
const permissionsCache = new NodeCache({ stdTTL: 900 }); // 15 minutes

app.get('/users/:userId/projects/:projectId/permissions', async (req, res) => {
  const cacheKey = `${userId}:${projectId}`;
  
  // Check cache first
  const cached = permissionsCache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // Fetch from database
  const permissions = await getPermissions(userId, projectId);
  
  // Cache response
  permissionsCache.set(cacheKey, { data: { permissions } });
  
  res.json({ data: { permissions } });
});
```

### Database Optimization

```sql
-- Add indexes for fast lookups
CREATE INDEX idx_user_project_permissions 
ON user_project_permissions(user_id, project_id);

CREATE INDEX idx_user_permissions 
ON user_permissions(user_id);
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Test project permissions
curl -X GET \
  "http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000/projects/73887c41-2d49-445b-85da-f86c65608a23/permissions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test global permissions
curl -X GET \
  "http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000/permissions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

```
GET {{baseUrl}}/users/{{userId}}/projects/{{projectId}}/permissions
Headers:
  Authorization: Bearer {{token}}
```

### Expected Response (Success)

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "permissions": [
      {
        "action": "manage",
        "subject": "all",
        "inverted": false
      }
    ]
  }
}
```

### Expected Response (Error)

```json
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Forbidden",
  "message": "You don't have permission to view these permissions"
}
```

---

## 📋 Quick Reference

### Frontend Sends:
```
GET /users/{userId}/projects/{projectId}/permissions
Headers: Authorization: Bearer {token}
Body: None
```

### Backend Returns:
```json
{
  "data": {
    "permissions": [
      { "action": "manage", "subject": "all", "inverted": false }
    ]
  }
}
```

### Permission Object Fields:
- `action`: string - 'create' | 'read' | 'update' | 'delete' | 'manage'
- `subject`: string - 'FundManagement' | 'Beneficiary' | 'Vendor' | etc. | 'all'
- `inverted`: boolean - false = allow, true = deny
- `conditions`: object (optional) - Advanced field-level rules

### Common Wildcards:
- `{ action: 'manage', subject: 'all' }` → Can do ANYTHING
- `{ action: 'manage', subject: 'FundManagement' }` → Can do all FundManagement operations
- `{ action: 'read', subject: 'all' }` → Can read EVERYTHING

---

## 🚀 Migration Path

### Phase 1: Mock (Current)
Frontend uses `permissions.mock.ts` - no backend needed yet.

### Phase 2: Backend Integration
1. Backend implements the two endpoints
2. Replace mock service with real API calls
3. Test with real data

### Phase 3: Optimization
1. Add backend caching (Redis/NodeCache)
2. Add database indexes
3. Monitor performance

---

## 📚 Related Files

- **Types**: `src/types/permissions.ts` - Permission interface
- **Hooks**: `src/hooks/usePermissions.ts` - React Query hooks
- **Mock**: `src/services/permissions.mock.ts` - Temporary mock API
- **Context**: `src/context/AbilityContext.tsx` - CASL integration
- **Store**: `src/store/permissions.store.ts` - Caching layer

---

## ✅ Checklist for Backend Team

- [ ] Create `GET /users/:userId/projects/:projectId/permissions` endpoint
- [ ] Create `GET /users/:userId/permissions` endpoint
- [ ] Return exact JSON structure: `{ data: { permissions: [...] } }`
- [ ] Each permission has: `action`, `subject`, `inverted` (and optional `conditions`)
- [ ] Implement JWT authentication
- [ ] Add role → permission mapping logic
- [ ] Consider using wildcards for bypass roles
- [ ] Add caching (optional but recommended)
- [ ] Test with frontend mock replaced by real API

---

## 🎉 Summary

**Frontend Request**:
```typescript
GET /users/{userId}/projects/{projectId}/permissions
Headers: { Authorization: 'Bearer {token}' }
```

**Backend Response**:
```json
{
  "data": {
    "permissions": [
      { "action": "manage", "subject": "all", "inverted": false }
    ]
  }
}
```

**That's it!** Simple contract, powerful system. 🚀
