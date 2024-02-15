import type { Metadata } from 'next';
import VendorsTable from '../../components/vendors/vendorsTable';

export const metadata: Metadata = {
  title: 'Vendorss',
};

export default function VendorsPage() {
  return (
    <div className="max-h-mx">
      <div className="flex items-center justify-between mb-9 mt-8">
        <h1 className="text-3xl font-semibold">Vendors List</h1>
      </div>
      <VendorsTable />
    </div>
  );
}
