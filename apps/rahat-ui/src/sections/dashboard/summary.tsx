import DataCard from 'apps/rahat-ui/src/components/dataCard';

const DashboardSummary = () => {
  return (
    <div>
      <div className=" grid md:grid-cols-4 gap-4">
        <DataCard
          className=""
          title="Total No. Of Beneficiaries"
          number={'12'}
          subTitle="+20% from last month"
        />
        <DataCard
          className=""
          title="Total No. Of Community"
          number={'12'}
          subTitle="+60% from last month"
        />
        <DataCard
          className=""
          title="Area Covered"
          number={'12'}
          subTitle="+40% from last month"
        />
        <DataCard
          className=""
          title="Total Donations"
          number={'$' + 12}
          subTitle="$35% from last month"
        />
      </div>
    </div>
  );
};

export default DashboardSummary;
