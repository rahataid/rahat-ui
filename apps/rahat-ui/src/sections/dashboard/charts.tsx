import ChartsCard from 'apps/rahat-ui/src/components/chartsCard';

const charts = () => {
  return (
    <div className=" grid md:grid-cols-4 gap-4 mt-4">
      <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
      <ChartsCard className="" title="Beneficiaries" image="/charts.png" />

      <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
      <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
    </div>
  );
};

export default charts;
