export default function ActivityDetailCard() {

    const detailData = [
        {
            title: 'Category',
            content: <p>Demo</p>
        },
        {
            title: 'Responsibility',
            content: <p>Demo</p>
        },
        {
            title: 'Hazard Type',
            content: <p>Demo</p>
        },
    ]

    return (
        <div className="bg-card p-4 rounded">
            <h1 className="font-semibold text-lg">Activity Details</h1>
            <div>
                {detailData.map((item) => (
                    <div key={item.title} className="mt-4">
                        <h1 className="text-muted-foreground text-sm">{item.title}</h1>
                        {item.content}
                    </div>
                ))}
            </div>
        </div>
    )
}