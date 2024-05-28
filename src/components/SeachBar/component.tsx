"use client";

import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

import { MusicReturn, AlbumReturn, ArtistReturn } from "itunes-web-api";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useToggle } from "@uidotdev/usehooks";
import { List, ListItem } from "../ListItem";
import { UniversalMusicResource, resultMapper } from "./mapper";
import { useDebounce } from "@uidotdev/usehooks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { ResultGroup } from "./ResultGroup";
import { useMusicSearch } from "./hooks";

// type for the search result
export type MusicSearchResult = {
    songs?: MusicReturn;
    albums?: AlbumReturn;
    artists?: ArtistReturn;
};

const defaultSearchConfig = ["artists", "albums", "songs"];

export function SearchBar() {
    const searchParams = useSearchParams();
    const [searchResultListing, setSearchResultListing] =
        useState<MusicSearchResult>({});
    const [open, toggle] = useToggle(false);
    const [search, setSearch] = useState<string>(searchParams.get("q") || "");
    const searchInput = useRef<HTMLInputElement>(null);

    const [searchConfig, setSearchConfig] =
        useState<string[]>(defaultSearchConfig);

    const { searchResult, loading } = useMusicSearch(
        search,
        searchConfig,
    );

    // Keyboard shortcut
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
                searchInput.current?.focus();
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [toggle]);

    // push state to url
    useEffect(() => {
        if (!open) {
            if (search) {
                setSearchResultListing(searchResult);
                const params = new URLSearchParams();
                params.set("q", search);
                window.history.pushState(null, "", `?${params.toString()}`);
            }
        }
    }, [searchResult, open, search]);

    // prevent searchConfig to be empty
    useEffect(() => {
        if (searchConfig.length === 0) {
            setSearchConfig([defaultSearchConfig[0]]);
            toast("Please Select at least one search category");
        }
    }, [searchConfig, setSearchConfig]);

    const setSearchAndClose = (value: string) => {
        setSearch(value);
        toggle(false);
        searchInput.current?.blur();
    };

    const autoSuggestData = resultMapper(searchResult);
    const listingData = resultMapper(searchResultListing);
    const empty =
        autoSuggestData.songs.length === 0 &&
        autoSuggestData.albums.length === 0 &&
        autoSuggestData.artists.length === 0;

    return (
        <div className="w-full gap-4 flex flex-col items-center">
            <div className="w-full flex flex-col-reverse items-center justify-center gap-4 md:flex-row">
                <Command
                    shouldFilter={false}
                    className="rounded-lg border shadow-md max-w-2xl relative overflow-visible"
                >
                    <CommandInput
                        placeholder="Search for music..."
                        value={search}
                        onValueChange={setSearch}
                        ref={searchInput}
                        onFocus={() => toggle(true)}
                        onBlur={() => toggle(false)}
                    />

                    <CommandList
                        className={cn(
                            open ? "" : "hidden",
                            "absolute z-10 w-full mt-10 border rounded-b-lg border-t-0 shadow-md",
                        )}
                    >
                        {search.length < 3 && (
                            <CommandItem>Please enter at least 3 characters</CommandItem>
                        )}

                        {search.length > 3 && empty && !loading && (
                            <CommandItem>No Item Found</CommandItem>
                        )}

                        <CommandItem
                            className="hidden"
                            onSelect={() => setSearchAndClose(search)}
                        >
                            {search}
                        </CommandItem>
                        <ResultGroup
                            title="Artists"
                            data={autoSuggestData.artists}
                            callback={setSearchAndClose}
                            loading={loading}
                        />
                        <CommandSeparator />
                        <ResultGroup
                            title="Albums"
                            data={autoSuggestData.albums}
                            callback={setSearchAndClose}
                            loading={loading}
                        />
                        <CommandSeparator />
                        <ResultGroup
                            title="Songs"
                            data={autoSuggestData.songs}
                            callback={setSearchAndClose}
                            loading={loading}
                        />
                    </CommandList>
                </Command>

                <ToggleGroup
                    type="multiple"
                    value={searchConfig}
                    onValueChange={setSearchConfig}
                >
                    {defaultSearchConfig.map((item) => (
                        <ToggleGroupItem key={item} value={item} className="capitalize">
                            {item}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>
            <List data={listingData} />
        </div>
    );
}
