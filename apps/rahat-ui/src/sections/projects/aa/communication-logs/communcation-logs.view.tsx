import DataCard from "apps/rahat-ui/src/components/dataCard";
import getIcon from "apps/rahat-ui/src/utils/getIcon";

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