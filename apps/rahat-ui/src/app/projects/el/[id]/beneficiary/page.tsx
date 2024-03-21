import { ELBeneficiaryView } from '../../../../../sections/projects/el/beneficiary';

const page = ({ params }) => {
  return <ELBeneficiaryView uuid={params.id} />;
};

export default page;
