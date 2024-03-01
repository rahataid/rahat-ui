import { BeneficiaryQuery } from '@rahat-ui/query';
import { AuthQuery, RoleQuery, UserQuery } from '@rumsan/react-query';
import { RumsanService } from '@rumsan/sdk';
import { useMemo, useState } from 'react';

export type RumsanQueryType = {
  authQuery: AuthQuery;
  userQuery: UserQuery;
  beneficiaryQuery: BeneficiaryQuery;
  roleQuery: RoleQuery;
};

export const useRumsanService = () => {
  const [rsService, setRsService] = useState<RumsanService>();
  const [query, setQuery] = useState<RumsanQueryType>();

  return useMemo(
    () => ({
      rsService,
      setRsService,
      query,
      ...query,
      setQuery,
    }),
    [rsService, query]
  );
};
