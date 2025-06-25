import Back from './back';

type IProps = {
  title: string;
  path: string;
  subtitle: string;
};

export default function HeaderWithBack({ title, path, subtitle }: IProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center space-x-2">
        <Back path={path} />
        <h1 className={`font-semibold text-[24px]`}>{title}</h1>
      </div>
      <p className="ml-9 text-muted-foreground text-base">{subtitle}</p>
    </div>
  );
}
