export default function TriggerDetailCard() {

    const triggerDetailData = [
        {
            title: 'River Basin',
            content: 'Karnali'
        },
        {
            title: 'Hazard Type',
            content: 'River Flood'
        },
        {
            title: 'Trigger Type',
            content: 'Automatic Trigger'
        },
    ]

    return (
        <div className="bg-card p-4 rounded">
            <h1 className="font-semibold text-lg">Trigger Details</h1>
            <div>
                {triggerDetailData.map((item) => (
                    <div key={item.title} className="mt-4">
                        <h1 className="text-muted-foreground text-sm">{item.title}</h1>
                        <p>{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}