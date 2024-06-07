import DocumentCard from "../../../components/document.card"

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
        {
            title: 'Description',
            content: <p>{activityDetail?.description}</p>
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
            <div className="mt-4">
                <h1 className="text-muted-foreground text-sm">Documents</h1>
                {activityDetail?.activityDocuments?.length ? (
                    <div className="grid gap-2 mt-2">
                        {
                            activityDetail?.activityDocuments?.map((d: any, index: number) => (
                                <DocumentCard key={index} name={d.fileName} path={d.mediaURL} />
                            ))
                        }
                    </div>
                ) : "-"}
            </div>
        </div>
    )
}