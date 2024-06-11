import { useCommunicationStats } from "@rahat-ui/query";
import DataCard from "apps/rahat-ui/src/components/dataCard";
import TableLoader from "apps/rahat-ui/src/components/table.loader";
import getIcon from "apps/rahat-ui/src/utils/getIcon";
import { UUID } from "crypto";
import { useParams } from "next/navigation";

const dummyLogs = [
    {
        componentType: 'DATACARD',
        title: 'SMS Recipients',
        value: '200',
        icon: 'Home'
    },
    {
        componentType: 'DATACARD',
        title: 'IVR Recipients',
        value: '312',
        icon: 'Home'
    },
    {
        componentType: 'DATACARD',
        title: 'SMS Recipients',
        value: '200',
        icon: 'Users'
    },
    {
        componentType: 'DATACARD',
        title: 'IVR Recipients',
        value: '312',
        icon: 'Home'
    },
    {
        componentType: 'DATACARD',
        title: 'SMS Recipients',
        value: '200',
        icon: 'Users'
    },
    {
        componentType: 'DATACARD',
        title: 'IVR Recipients',
        value: '312',
        icon: 'Home'
    },
    {
        componentType: 'DATACARD',
        title: 'SMS Recipients',
        value: '200',
        icon: 'Users'
    },
    {
        componentType: 'DATACARD',
        title: 'IVR Recipients',
        value: '312',
        icon: 'Home'
    }
]


export default function CommunicationLogsView() {
    const { id: projectID } = useParams();
    const {data,isLoading} = useCommunicationStats(projectID as UUID)

    console.log(data)

    if(isLoading) return <TableLoader />

    return (
        <div className="p-4 bg-secondary h-[calc(100vh-65px)]">

            <h1 className="text-xl font-semibold">Communication Summary</h1>

            <div className="grid md:grid-cols-4 gap-4 mt-4">
                {
                    dummyLogs.map((d) => {
                        if (d.componentType === 'DATACARD') {
                            return (
                                <DataCard
                                    title={d.title}
                                    number={d.value}
                                    Icon={getIcon(d.icon)}
                                />
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}