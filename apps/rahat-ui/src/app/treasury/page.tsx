import TreasuryView from '../../sections/treasury/treasury.view';

export const metadata = {
  title: 'Treasury',
};

export default function TreasuryPage() {
  return (
    <div className="bg-secondary p-2 h-[calc(100vh-80px)]">
      <TreasuryView />
    </div>
  );
}
