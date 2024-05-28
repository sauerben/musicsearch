import { Badge } from "../ui/badge";
import { CommandGroup, CommandItem } from "../ui/command";
import { Skeleton } from "../ui/skeleton";
import { UniversalMusicResource } from "./mapper";

const ResultGroup: React.FC<{
  title: string;
  data: UniversalMusicResource[];
  callback: (value: string) => void;
  loading: boolean;
}> = ({ title, data, callback, loading }) => {
  if (data.length === 0) return null;

  return (
    <CommandGroup heading={title}>
      {loading
        ? Array.from(Array(3).keys()).map((_, index) => (
            <CommandItem key={index}>
              <SuggestSkeleton />
            </CommandItem>
          ))
        : data.slice(0, 3).map((item) => (
            <CommandItem
              onSelect={() => callback(item.title)}
              onClick={() => callback(item.title)}
              key={item.id}
            >
              <div className="flex items-center space-x-4 w-full">
                {!!item.image ? (
                  <img
                    className="h-12 w-12  rounded-md flex-0"
                    src={item.image}
                    alt={item.title}
                  />
                ) : (
                  <Skeleton className="h-12 w-12 rounded-md" />
                )}

                <div className="space-y-2 grow">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6">
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {item.title}
                    </p>
                    <p className="flex text-xs leading-5 ">{item.subtitle}</p>
                    <span className="hidden">{item.id}</span>
                  </div>
                </div>
                <div className="flex-0">
                  <Badge variant="secondary">{item.origianlType}</Badge>
                </div>
              </div>
            </CommandItem>
          ))}
    </CommandGroup>
  );
};

export function SuggestSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export { ResultGroup };
