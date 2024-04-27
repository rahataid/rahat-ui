type Field = {
  value: string;
  label: string;
};

export const useActivitiesFields = () => {
  const hazardType: Field[] = [
    {
      value: 'hazard1',
      label: 'Hazard1',
    },
    {
      value: 'hazard2',
      label: 'Hazard2',
    },
    {
      value: 'hazard3',
      label: 'Hazard3',
    },
    {
      value: 'hazard4',
      label: 'Hazard4',
    },
    {
      value: 'hazard5',
      label: 'Hazard5',
    },
  ];

  const category: Field[] = [
    {
      value: 'category1',
      label: 'General Actions',
    },
    {
      value: 'category2',
      label: 'Early Warning Communication',
    },
    {
      value: 'category3',
      label: 'Cleaning the drains',
    },
    {
      value: 'category4',
      label: 'Strengthening embankments by placing sand bags',
    },
    {
      value: 'category5',
      label: 'Support for early harvesting',
    },
    {
      value: 'category6',
      label: 'Managing drinking water',
    },
    {
      value: 'category7',
      label: 'Cash transfer',
    },
  ];

  const phase: Field[] = [
    {
      value: 'preparedness',
      label: 'Preparedness',
    },
    {
      value: 'readiness',
      label: 'Readiness',
    },
    {
      value: 'activation',
      label: 'Activation',
    },
  ];

  return { hazardType, category, phase };
};
