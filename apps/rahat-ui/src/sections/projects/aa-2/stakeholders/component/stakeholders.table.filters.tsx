import * as React from 'react';
import { UUID } from 'crypto';
import { AddButton, SearchInput } from 'apps/rahat-ui/src/common';
// import AddButton from '../../components/add.btn';
// import SearchInput from '../../components/search.input';

type IHandleSearch = (
  event: React.ChangeEvent<HTMLInputElement>,
  key: string,
) => void;

type IProps = {
  projectID: UUID;
  filters: any;
  setFilters: any;
};

export default function StakeholdersTableFilters({
  projectID,
  filters,
  setFilters,
}: IProps) {
  const [stakeholderSearchText, setStakeholderSearchText] = React.useState('');
  const [organizationSearchText, setOrganizationSearchText] =
    React.useState('');
  const [municipalitySearchText, setMunicipalitySearchText] =
    React.useState('');
  const [supportAreaText, setSupportAreaText] = React.useState('');
  const handleSearch: IHandleSearch = React.useCallback(
    (event, key) => {
      setFilters({ ...filters, [key]: event.target.value });
    },
    [filters],
  );
  const fromGroup = window.location.pathname.split('/').includes('groups');
  React.useEffect(() => {
    setStakeholderSearchText(filters?.name ?? '');
    setOrganizationSearchText(filters?.organization ?? '');
    setMunicipalitySearchText(filters?.municipality ?? '');
    setSupportAreaText(filters?.supportArea ?? '');
  }, [filters]);
  return (
    <div className="flex justify-between space-x-2 items-center mb-2">
      {/* Search Stakeholder */}
      <SearchInput
        className="w-full"
        name="name"
        value={stakeholderSearchText}
        onSearch={(e) => handleSearch(e, 'name')}
      />

      {/* Search Organization */}
      <SearchInput
        className="w-full"
        name="organization"
        value={organizationSearchText}
        onSearch={(e) => handleSearch(e, 'organization')}
      />

      {/* Search Municipality */}
      <SearchInput
        className="w-full"
        name="municipality"
        value={municipalitySearchText}
        onSearch={(e) => handleSearch(e, 'municipality')}
      />

      {/* Search support area */}
      <SearchInput
        className="w-full"
        name="support area"
        value={supportAreaText}
        onSearch={(e) => handleSearch(e, 'supportArea')}
      />
    </div>
  );
}
