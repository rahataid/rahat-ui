'use client';

import {
  useProjectDetails as useProjectSubgraphDetails,
  useC2CProjectSubgraphStore,
} from '@rahataid/c2c-query';
import BeneficiaryTable from './beneficiary.table';
import { useParams } from 'next/navigation';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';

const BeneficiaryView = () => {
  const { id } = useParams();
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  useProjectSubgraphDetails(contractSettings?.rahattoken?.address);
  const s = useC2CProjectSubgraphStore((state) => state.projectDetails);
  console.log('s', s);
  return <BeneficiaryTable />;
};

export default BeneficiaryView;
