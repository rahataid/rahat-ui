import VendorTable from './vendors.table';

export default function VendorView({uuid}:{uuid:string}) {
  return <VendorTable uuid={uuid}/>;
}
