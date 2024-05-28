import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MusicResult } from "itunes-web-api";
import { UniversalMusicResource, UniversalMusicResult } from "../SeachBar";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

type ListItemProps = {
  data: UniversalMusicResource;
};

const List: React.FC<{ data: UniversalMusicResult }> = ({ data }) => {
  const empty =
    data.songs.length === 0 &&
    data.albums.length === 0 &&
    data.artists.length === 0;

  if (empty) {
    return null;
  }
  return (
    <ul
      role="list"
      className="w-full border divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden shadow-sm rounded-lg "
    >
      {data.artists.map((data: UniversalMusicResource) => (
        <ListItem data={data} key={data.id} />
      ))}

      {data.albums.map((data: UniversalMusicResource) => (
        <ListItem data={data} key={data.id} />
      ))}

      {data.songs.map((data: UniversalMusicResource) => (
        <ListItem data={data} key={data.id} />
      ))}
    </ul>
  );
};

const ListItem: React.FC<ListItemProps> = ({ data }) => {
  return (
    <li
      key={data.id}
      className="relative flex  justify-between gap-x-2 px-2 py-2 hover:bg-gray-50 dark:hover:bg-slate-900"
    >
      <div className="flex min-w-0 gap-x-4">
        {data.image ? (
          <img
            className="h-24 w-24 flex-none rounded-md "
            src={data.image}
            alt={data.title}
          />
        ) : (
          <Skeleton className="h-24 w-24 rounded-md" />
        )}
        <div className="flex flex-col min-w-0 flex-auto justify-center">
          <p className="text-lg font-bold leading-6">{data.title}</p>
          <p className="mt-1 flex text leading-5 ">{data.subtitle}</p>
          <p className="mt-1 text-sm leading-6 ">{data.extra1}</p>
          <p className="mt-1 text-sm leading-6 ">{data.extra3}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-x-4">
        <div className="hidden sm:flex sm:flex-col sm:items-end gap-1">
          {!!data.extra2 && <Badge variant="outline">{data.extra2}</Badge>}
          <Badge variant="secondary">{data.origianlType}</Badge>
        </div>
      </div>
    </li>
  );
};

export { ListItem, List };
