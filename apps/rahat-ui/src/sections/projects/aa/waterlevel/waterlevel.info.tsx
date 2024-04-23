import { FC } from 'react';

type WaterLevelInfoProps = {
    data: any;
};

const renderStatus = ({ warningLevel, dangerLevel, waterLevel }: any) => {
    let status;
    if (waterLevel >= dangerLevel) {
        status = "danger";
    } else if (waterLevel >= warningLevel) {
        status = "warning";
    } else {
        status = "safe";
    }

    return (
        <div>
            <p className={`mt-4 sm:mt-8 sm:w-2/3 ${status === "danger" ? "text-red-500" : status === "warning" ? "text-yellow-500" : "text-green-500"}`}>
                {status === "danger" ? "Water is in danger level!" : status === "warning" ? "Water is in warning level!" : "Water is in safe level"}
            </p>
            <p className="font-light">Status</p>
        </div>
    );
};

const WaterLevelInfo: FC<WaterLevelInfoProps> = ({ data }) => {
    if (!data) {
        return (
            <div className="grid grid-cols-1 rounded-sm bg-card p-4 mb-2 shadow">
                <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
                    <div>
                        <p className="font-light">Water level data not found.</p>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 rounded-sm bg-card p-4 mb-2 shadow">
            <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
                <div>
                    <p className="font-medium text-primary">{data?.Schedule?.dataSource}</p>
                    <p className="font-light">Data Source</p>
                </div>
                <div>
                    <p className="font-medium text-primary">{data?.Schedule?.location}</p>
                    <p className="font-light">Location</p>
                </div>
                <div>
                    <p className="font-medium text-primary">{data?.data?.waterLevel}</p>
                    <p className="font-light">Water Level</p>
                </div>
            </div>
            <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
                <div>
                    <p className="font-medium text-primary">{data?.Schedule?.warningLevel}</p>
                    <p className="font-light">Warning Level</p>
                </div>
                <div>
                    <p className="font-medium text-primary">{data?.Schedule?.dangerLevel}</p>
                    <p className="font-light">Danger Level</p>
                </div>
            </div>
            {renderStatus({
                warningLevel: data?.Schedule?.warningLevel,
                dangerLevel: data?.Schedule?.dangerLevel,
                waterLevel: data?.data?.waterLevel
            })}

        </div>
    );
};

export default WaterLevelInfo
