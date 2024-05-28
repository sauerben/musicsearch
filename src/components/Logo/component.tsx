import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <h1
      className={cn(
        className,
        "text-4xl font-black grid grid-cols-2 justify-items-center gap-1",
      )}
    >
      <span>🔊</span>
      <span>🔎</span>
      <span>Music</span>
      <span>Search</span>
    </h1>
  );
};

export { Logo };
