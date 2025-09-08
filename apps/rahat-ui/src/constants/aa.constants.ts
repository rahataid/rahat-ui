// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.

import { ALL } from 'dns';

// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export const ACTIVITY_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  FAILED: 'FAILED',
  WORK_IN_PROGRESS: 'WORK_IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DELAYED: 'DELAYED',
  PENDING: 'PENDING',
  ALL: 'ALL',
};

export const ONE_TOKEN_VALUE = 1;

export const INFO_TOOL_TIPS: Record<string, string> = {
  'Token Disbursed': 'Total number of tokens disbursed to beneficiaries.',
  'Budget Assigned': 'Total budget allocated for this project',
  Token: 'Name of the token being used.',
  'Token Price': 'The monetary value of a single token.',
  'Total Beneficiaries': 'Total number of people receiving tokens.',
  'Average Disbursement time':
    'Average time taken for the token to be disbursed to the beneficiary wallet',
  'Average Duration':
    'Gap between Activation phase triggered and successful disbursement',
};
