import { Option } from '@rahat-ui/shadcn/src/components/custom/multi-select';
import {
  SelectItem,
  SelectLabel,
} from '@rahat-ui/shadcn/src/components/ui/select';
import Loader from 'apps/community-tool-ui/src/components/Loader';

export const renderGroups = (data: Option[], isLoading: boolean) => {
  if (isLoading) {
    return (
      <SelectLabel>
        <Loader />
      </SelectLabel>
    );
  }

  if (data.length === 0) {
    return <SelectLabel>No groups found</SelectLabel>;
  }

  return data.map((group: any) => (
    <SelectItem key={group.value} value={group.value}>
      {group.label}
    </SelectItem>
  ));
};
