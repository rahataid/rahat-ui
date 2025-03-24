import Link from 'next/link';
import DataCard from '../../components/dataCard';
import { getValueFromPath } from '../../utils/extractObjetInfo';
import getIcon from '../../utils/getIcon';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { UUID } from 'crypto';
import { usePagination } from '@rahat-ui/query';
type DataCardData = {
  component: any;
  source: any;
  actualData: any;
};

const Total_Villagers_Referred = 'Total Villagers Referred';

const DataCardWrapper = ({ actualData, component, source }: DataCardData) => {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const { pagination, filters, setFilters } = usePagination();
  const projectSlug = 'el-cambodia';

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

  console.log(component);
  const cardDataValue =
    component.type === 'dataCard' && relevantData ? relevantData.data : '-';

  // Render DataCard with the retrieved value
  if (cardDataValue !== null) {
    const icon = getIcon(component?.icon);

    const handleClick = () => {
      if (component?.title === Total_Villagers_Referred) {
        setFilters({});
        const targetUrl = `/projects/${projectSlug}/${id}/beneficiary`;
        setFilters({
          type: 'Lead',
        });
        router.push(targetUrl);
      }
    };

    return (
      <div
        onClick={handleClick}
        className={component?.isHref ? 'hover:cursor-pointer' : ''}
      >
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
