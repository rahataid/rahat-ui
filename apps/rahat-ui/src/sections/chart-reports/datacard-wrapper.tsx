import DataCard from '../../components/dataCard';
import { getValueFromPath } from '../../utils/extractObjetInfo';

type DataCardData = {
  component: any;
  source: any;
  actualData: any;
};

const DataCardWrapper = ({ actualData, component, source }: DataCardData) => {
  // Split the dataMap to extract the name and the path within the object
  const [name, ...pathParts] = component.dataMap.split('.');
  const path = pathParts.join('.');

  console.log('first', {
    actualData,
    component,
    source,
    path,
    pathParts,
    name,
  });

  if (!actualData) return null;

  // Find the relevant object in actualData by name
  const relevantData = actualData?.find((d) => d.name === name);

  // Use getValueFromPath to find the value inside the relevant object
  const cardDataValue =
    component.type === 'dataCard' && path && relevantData
      ? getValueFromPath(relevantData.data, path)
      : null;

  console.log('Card Data Value:', cardDataValue);

  // Render DataCard with the retrieved value
  if (cardDataValue !== null) {
    return (
      <DataCard
        title={component.title}
        number={cardDataValue?.count || cardDataValue}
      />
    );
  }

  return null; // Or handle cases where data is not found
};

export default DataCardWrapper;
