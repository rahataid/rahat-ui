import Link from 'next/link';
import DataCard from '../../components/dataCard';
import { getValueFromPath } from '../../utils/extractObjetInfo';
import getIcon from '../../utils/getIcon';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { usePagination } from '@rahat-ui/query';

type DataCardData = {
  component: any;
  source: any;
  actualData: any;
};

const DataCardWrapper = ({ actualData, component, source }: DataCardData) => {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const { pagination, filters } = usePagination();
  const projectSlug = 'el-cambodia';
  // if (projectSlug) filters.type = 'Lead';
  const encodedFilters = encodeURIComponent(
    JSON.stringify((filters.type = 'Lead')),
  );
  const encodedPagination = encodeURIComponent(JSON.stringify(pagination));
  // Split the dataMap to extract the name and the path within the object
  const [name, ...pathParts] = component.dataMap.split('.');
  const path = pathParts.join('.');

  if (!actualData) return null;

  // Find the relevant object in actualData by name
  const relevantData = actualData?.find((d: any) => d.name === name);

  // Use getValueFromPath to find the value inside the relevant object
  // const cardDataValue =
  //   component.type === 'dataCard' && path && relevantData
  //     ? getValueFromPath(relevantData.data, path)
  //     : null;

  const cardDataValue =
    component.type === 'dataCard' && relevantData ? relevantData.data : '-';

  // Render DataCard with the retrieved value
  if (cardDataValue !== null) {
    const icon = getIcon(component?.icon);

    const handleClick = (e) => {
      if (component?.title === 'Total Villagers Referred') {
        e.preventDefault();

        const targetUrl = `/projects/${projectSlug}/${id}/beneficiary#filters=${encodedFilters}&pagination=${encodedPagination}`;
        router.push(targetUrl);
      }
    };
    return (
      <div onClick={handleClick} className="hover:cursor-pointer">
        <DataCard
          className="border-solid rounded-md"
          iconStyle="bg-white text-black"
          title={component.title}
          // number={cardDataValue?.count === 0 ? 0 : cardDataValue?.count}
          number={
            cardDataValue?.count?.toString() ||
            cardDataValue?.count ||
            cardDataValue
          }
          Icon={icon}
        />
      </div>
    );
  }

  return null; // Or handle cases where data is not found
};

export default DataCardWrapper;
