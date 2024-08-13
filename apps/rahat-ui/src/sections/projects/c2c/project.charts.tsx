import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import React from 'react';

const ProjectCharts = () => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-2">
      <PieChart
        title="Gender"
        subheader="Project Stats"
        chart={{
          series: [
            { label: 'Male', value: 50 },
            { label: 'Female', value: 10 },
          ],
        }}
      />
      <PieChart
        title="Age"
        subheader="Project Stats"
        chart={{
          series: [
            { label: 'Under 18', value: 20 },
            { label: '18-24', value: 30 },
            { label: '25+', value: 50 },
          ],
        }}
      />
      <PieChart
        title="Disburse Methods"
        subheader="Project Stats"
        chart={{
          series: [
            { label: 'Project', value: 40 },
            { label: 'EOA', value: 60 },
            { label: 'MULTISIG', value: 50 },
          ],
        }}
      />
    </div>
  );
};

export default ProjectCharts;
