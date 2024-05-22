export default function AutomatedTriggerDetailCard({ triggerDetail }: any) {
  const triggerDetailData = [
    {
      title: 'River Basin',
      content: <p>{triggerDetail?.location}</p>,
    },
    {
      title: 'Hazard Type',
      content: <p>{triggerDetail?.hazardType?.name}</p>,
    },
    {
      title: 'Trigger Type',
      content: (
        <p>
          {triggerDetail?.dataSource === 'MANUAL'
            ? 'Manual Trigger'
            : 'Automated Trigger'}
        </p>
      ),
    },
  ];

  return (
    <div className="bg-card p-4 rounded">
      <h1 className="font-semibold text-lg">Trigger Details</h1>
      <div>
        {triggerDetailData.map((item) => (
          <div key={item.title} className="mt-4">
            <h1 className="text-muted-foreground text-sm">{item.title}</h1>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
