import { OfflineTable } from './table';

const List = () => {
  return (
    <div className="bg-card rounded-lg m-4 p-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Offline Management
        </h1>
        <p className="text-gray-500 font-normal text-base">
          Here is the list of all vendors
        </p>
      </div>
      <div>
        <OfflineTable />
      </div>
    </div>
  );
};

export default List;
