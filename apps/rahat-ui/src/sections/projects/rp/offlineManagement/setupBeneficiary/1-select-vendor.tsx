type Step1SelectVendorProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Step1SelectVendor({}: Step1SelectVendorProps) {
  return (
    <div className="bg-card rounded px-4 pb-4 flex flex-col">
      <div className="mb-2">
        <div className="flex flex-col">Step 1</div>
      </div>
    </div>
  );
}
