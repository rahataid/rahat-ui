# Coding patterns & architecture intent

Same purpose as the matching doc in the other 3 repos in this ecosystem.

## 1. Routes are thin, `sections/` holds the logic

`app/<route>/page.tsx` renders a component from `sections/<matching-path>/`. Don't put data-fetching or significant logic directly in an `app/` page file — build it in `sections/` and import.

## 2. All backend calls go through `libs/query`

```ts
export const useProjectAction = <T = any>(key?: string[]) => {
  const { queryClient, rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  return useMutation({ mutationFn: projectClient.projectActions }, queryClient);
};
```

(`libs/query/src/lib/projects/projects.service.ts`.) A component never calls `fetch`/`axios` directly for backend data — it uses a hook from `libs/query/src/lib/<project>/`, which itself goes through `useProjectAction` (for project-microservice actions) or a plain `api.get/post` (`libs/query/src/utils/api.ts`, for core's own direct REST endpoints like `/projects`). New backend calls get a new hook in the matching `libs/query/src/lib/<project>/` folder, not an inline call in a component.

## 3. Action keys: use the `MS_ACTIONS` constant, not a literal string

```ts
// Preferred:
data: { action: MS_ACTIONS.SETTINGS.LIST, payload: {} }
// Seen in the codebase, works today but don't copy it for new code:
data: { action: 'settings.list', payload: {} }
```

The literal and the constant happen to match today; nothing guarantees they'll stay in sync if `rahat-platform`'s `libs/sdk` changes the string. Always import from `@rahataid/sdk`.

## 4. React Query via `useRSQuery`, not raw `@tanstack/react-query` setup

Every query/mutation hook here goes through `@rumsan/react-query`'s `useRSQuery()` (gives `queryClient` + `rumsanService`), not a bare `useQuery`/`useMutation` with manually-constructed fetchers — keeps auth/client config centralized.

## 5. Two parallel AA implementations — know which one you're editing

`sections/projects/aa/` and `sections/projects/aa-2/` both exist. See AGENT.md's module map note. Before editing an AA UI feature, check `app/projects/aa/` (and any feature flag / routing logic) to confirm which implementation is actually rendered — don't assume editing `aa-2/` (the newer-looking one) is automatically correct, or that `aa/` is dead just because a `-2` exists.

## 6. i18n

`next-intl`, message files in `apps/rahat-ui/messages/`. New user-facing strings go through the translation system, not hardcoded — check an existing `sections/` file in the same area for the `useTranslations` pattern before adding a new string.

## Related

- [AGENT.md](../../AGENT.md) — repo structure, module map, the AA dual-implementation note.
- `rahat-platform`'s `docs/agent/action-dispatch.md` — what actually happens after `projectClient.projectActions()` is called.

_Last updated: 2026-10-26_
