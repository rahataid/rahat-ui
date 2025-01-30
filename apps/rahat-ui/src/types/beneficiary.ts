// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { ListBeneficiary, Meta } from '@rahat-ui/types';

export interface IBeneficiaryItem {
  uuid?: string;
  walletAddress?: string;
  updatedAt: Date;
  verified?: boolean;
}

export interface IBeneficiaryTableData {
  data: ListBeneficiary[];
  meta?: Meta;
}
