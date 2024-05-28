import { AlbumResult, ArtistResult, MusicResult } from "itunes-web-api";
import { MusicSearchResult } from "./component";
import { millisToMinutesAndSeconds } from "./helper";

type UniversalMusicResource = {
  origianlType: "Artist" | "Album" | "Song";
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  extra1?: string;
  extra2?: string;
  extra3?: string;
};

type UniversalMusicResult = {
  songs: UniversalMusicResource[];
  albums: UniversalMusicResource[];
  artists: UniversalMusicResource[];
};

const artistMapper = (data: ArtistResult): UniversalMusicResource => {
  return {
    origianlType: "Artist",
    id: data.artistId,
    title: data.artistName,
    subtitle: "",
    image: "",
    extra2: data.primaryGenreName,
    link: data.artistLinkUrl,
  };
};
const albumMapper = (data: AlbumResult): UniversalMusicResource => {
  return {
    origianlType: "Album",
    id: data.collectionId,
    title: data.collectionName,
    subtitle: data.artistName,
    image: data.artworkUrl100,
    link: data.collectionViewUrl,
    extra1:
      data.releaseDate instanceof Date
        ? data.releaseDate.toLocaleDateString()
        : "",
    extra2: data.primaryGenreName,
    extra3: "Tracks: " + data.trackCount.toString(),
  };
};

const songMapper = (data: MusicResult): UniversalMusicResource => {
  return {
    origianlType: "Song",
    id: data.trackId,
    title: data.trackName,
    subtitle: data.artistName,
    image: data.artworkUrl100,
    link: data.trackViewUrl,
    extra1: data.collectionName,
    extra2: data.primaryGenreName,
    extra3: "Time: " + millisToMinutesAndSeconds(data.trackTimeMillis),
  };
};

const resultMapper = (data: MusicSearchResult): UniversalMusicResult => {
  return {
    songs:
      data?.songs?.results?.map((data: MusicResult) => songMapper(data)) || [],
    albums:
      data?.albums?.results?.map((data: AlbumResult) => albumMapper(data)) ||
      [],
    artists:
      data?.artists?.results?.map((data: ArtistResult) => artistMapper(data)) ||
      [],
  };
};

export { artistMapper, albumMapper, songMapper, resultMapper };
export type { UniversalMusicResource, UniversalMusicResult };
