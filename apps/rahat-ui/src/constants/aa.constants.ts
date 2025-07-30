// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export const ACTIVITY_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  WORK_IN_PROGRESS: 'WORK_IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DELAYED: 'DELAYED',
};

export const ONE_TOKEN_VALUE = 1;

export const INFO_TOOL_TIPS: Record<string, string> = {
  'Token Disbursed': 'Total number of tokens disbursed to beneficiaries.',
  'Budget Assigned': 'Total budget allocated for this program.',
  Token: 'Name of the token being used.',
  'Token Price': 'The monetary value of a single token.',
  'Total Beneficiaries': 'Total number of people receiving tokens.',
  'Average Disbursement time': 'Time taken on average to disburse tokens.',
  'Average Duration': 'Average time duration for all transactions.',
};
