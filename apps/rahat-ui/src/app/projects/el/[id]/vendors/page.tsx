import { ELVendorView } from '../../../../../sections/projects/el/vendors';

const Page = ({ params }) => {
  return <ELVendorView uuid={params.id} />;
};

export default Page;
