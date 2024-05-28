import { getAlbum, getArtist, getSong, options } from "itunes-web-api";
import { useEffect, useState } from "react";
import { MusicSearchResult } from "./component";
import { useDebounce } from "@uidotdev/usehooks";

const defaultQueryConfig: options = {
  limit: 10,
  language: "en",
  country: "US",
};

const useMusicSearch = (search: string, searchConfig: string[]) => {
  const [searchResult, setSearchResult] = useState<MusicSearchResult>({});
  const [loading, setLoading] = useState<boolean>(false);
  const debouncedSearchTerm = useDebounce(search, 200);

  // set loading state
  useEffect(() => {
    setLoading(true);
  }, [search, setLoading]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 2) {
      setLoading(true);

      const songs = getSong(debouncedSearchTerm, {
        ...defaultQueryConfig,
      });

      const albums = getAlbum(debouncedSearchTerm, {
        ...defaultQueryConfig,
      });

      const artists = getArtist(debouncedSearchTerm, {
        ...defaultQueryConfig,
      });

      Promise.all([songs, albums, artists]).then((values) => {
        if (!searchConfig.includes("songs")) {
          values[0] = { resultCount: 0, results: [] };
        }

        if (!searchConfig.includes("albums")) {
          values[1] = { resultCount: 0, results: [] };
        }

        if (!searchConfig.includes("artists")) {
          values[2] = { resultCount: 0, results: [] };
        }

        setSearchResult({
          songs: values[0],
          albums: values[1],
          artists: values[2],
        });

        setLoading(false);
      });
    } else {
      setSearchResult({});
      setLoading(false);
    }
  }, [debouncedSearchTerm, searchConfig]);

  return { searchResult, loading, setLoading };
};

export { useMusicSearch };
