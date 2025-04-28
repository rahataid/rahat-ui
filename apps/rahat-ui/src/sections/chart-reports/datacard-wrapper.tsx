import DataCard from '../../components/dataCard';
import { getValueFromPath } from '../../utils/extractObjetInfo';
import getIcon from '../../utils/getIcon';

type DataCardData = {
  component: any;
  source: any;
  actualData: any;
};

const DataCardWrapper = ({ actualData, component, source }: DataCardData) => {
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
    return (
      <DataCard
        className="border-solid rounded-sm"
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
    );
  }

  return null; // Or handle cases where data is not found
};

export default DataCardWrapper;
