export default function ActivityDetailCard({ activityDetail }: any) {

    const detailData = [
        {
            title: 'Category',
            content: <p>{activityDetail?.category?.name}</p>
        },
        {
            title: 'Responsibility',
            content: <p>{activityDetail?.responsibility}</p>
        },
        {
            title: 'Hazard Type',
            content: <p>{activityDetail?.hazardType?.name}</p>
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