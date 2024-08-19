import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

type IProps = {
  path: string;
  name: string;
  phaseId: string;
};

export default function PhaseCard({ path, name, phaseId }: IProps) {
  const router = useRouter();

  const cardBgColor = name === 'READINESS' ? 'bg-yellow-300' : 'bg-red-300';

  const handleClick = (ref: string) => {
    localStorage.setItem(
      'selectedPhase',
      JSON.stringify({
        name: name,
        phaseId: phaseId,
      }),
    );
    router.push(ref);
  };

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        handleClick(path);
      }}
    >
      <div
        className={`relative w-48 rounded p-4 grid gap-3 place-items-center ${cardBgColor}`}
      >
        <Settings
          size={20}
          className="absolute top-4 right-4 text-muted-foreground"
        />
        <div className="w-20 h-20 rounded-full bg-secondary grid place-items-center">
          <p className="font-semibold text-4xl text-muted-foreground">
            {name.charAt(0)}
          </p>
        </div>
        <p className="font-medium">{name}</p>
      </div>
    </div>
  );
}
