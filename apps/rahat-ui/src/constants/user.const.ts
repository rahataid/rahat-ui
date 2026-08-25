// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
import { ACTIONS, SUBJECTS } from './ability.constants';

// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export const USER_NAV_ROUTE = {
  ADD_ROLE: 'add_role',
  LIST_ROLE: 'list_role',
  DEFAULT: 'default',
  ADD_USER: 'add_user',
};

const ACTION_ITEMS = [
  ACTIONS.MANAGE,
  ACTIONS.CREATE,
  ACTIONS.READ,
  ACTIONS.UPDATE,
  ACTIONS.DELETE,
];

export const SUBJECT_ACTIONS = {
  all: ACTION_ITEMS,
  beneficiary: ACTION_ITEMS,
  role: ACTION_ITEMS,
  settings: ACTION_ITEMS,
  user: ACTION_ITEMS,
  project: ACTION_ITEMS,
  vendor: ACTION_ITEMS,
};

// Subjects listed here get extra actions on top of ACTION_ITEMS.
// Any subject not listed falls back to ACTION_ITEMS by default.
const PROJECT_SUBJECT_ACTION_OVERRIDES: Partial<Record<string, string[]>> = {
  [SUBJECTS.TRIGGER]: [
    ACTIONS.MANAGE,
    ACTIONS.CREATE,
    ACTIONS.UPDATE,
    ACTIONS.DELETE,
    ACTIONS.ACTIVATE,
  ],
  [SUBJECTS.PHASE]: [ACTIONS.REVERT],
  [SUBJECTS.ACTIVITY]: [
    ACTIONS.MANAGE,
    ACTIONS.CREATE,
    ACTIONS.UPDATE,
    ACTIONS.DELETE,
  ],
  [SUBJECTS.FUND_MANAGEMENT]: [ACTIONS.MANAGE, ACTIONS.CREATE, ACTIONS.READ],
  [SUBJECTS.PAYOUT]: [
    ACTIONS.MANAGE,
    ACTIONS.CREATE,
    ACTIONS.UPDATE,
    ACTIONS.READ,
  ],
};

// `all` is a global subject owned by SUBJECT_ACTIONS; keep it out of the
// project subject list so global manage-all stays a system-level permission.
export const PROJECT_SUBJECT_ACTIONS: Record<string, string[]> =
  Object.fromEntries(
    Object.values(SUBJECTS)
      .filter((subject) => subject !== SUBJECTS.ALL)
      .map((subject) => [
        subject,
        PROJECT_SUBJECT_ACTION_OVERRIDES[subject] ?? ACTION_ITEMS,
      ]),
  );
