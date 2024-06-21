import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

const ProjectCharts = () => {
  return (

    <div className="grid grid-cols-3 gap-4 rounded-sm p-0 mt-2 mb-2">
      <PieChart
        title="Gender"
        subheader="Project Stats"
        chart={{
          series: [
            { label: 'Male', value: 5 },
            { label: 'Female', value: 3 },
          ],
        }}
      />
      <PieChart
        title="Age"
        subheader="Project Stats"
        chart={{
          series: [
            { label: 'Under 18', value: 2 },
            { label: '18-24', value: 4 },
            { label: '25+', value: 2 },
          ],
        }}
      />
      <PieChart
        title="Disburse Status"
        subheader="Project Stats"
        chart={{
          series: [
            { label: 'Allocated', value: 8 },
            { label: 'Disbursed', value: 2 },
            { label: 'Redeemed', value: 1 },
          ],
        }}
      />
    </div>
  );
};

export default ProjectCharts;
