import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import SearchFilterBar from "@/components/SearchFilterBar";
import CharacterCard from "@/components/CharacterCard";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import type { Character, CharactersResponse } from "@/types/rm";

const API_BASE = "https://rickandmortyapi.com/api";

function useURLState() {
  const [params, setParams] = useSearchParams();

  const state = useMemo(() => {
    return {
      q: params.get("q") ?? "",
      status: params.get("status") ?? "",
      gender: params.get("gender") ?? "",
      sort: params.get("sort") ?? "name_asc", // name_asc | name_desc | created_asc | created_desc
      page: Math.max(1, parseInt(params.get("page") || "1", 10) || 1),
      fav: params.get("fav") === "1", // favorites only
    };
  }, [params]);

  const update = (updates: Partial<typeof state>) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (typeof v === "string") {
        if (v.length) next.set(k, v);
        else next.delete(k);
      } else if (typeof v === "number") {
        next.set(k, String(v));
      } else if (typeof v === "boolean") {
        if (v) next.set(k, "1");
        else next.delete(k);
      }
    });
    setParams(next, { replace: true });
  };

  return [state, update] as const;
}

function fetchCharacters({
  page,
  q,
  status,
  gender,
  signal,
}: {
  page: number;
  q: string;
  status: string;
  gender: string;
  signal: AbortSignal;
}): Promise<CharactersResponse> {
  const search = new URLSearchParams();
  if (page) search.set("page", String(page));
  if (q) search.set("name", q);
  if (status) search.set("status", status);
  if (gender) search.set("gender", gender);
  const url = `${API_BASE}/character?${search.toString()}`;
  return fetch(url, { signal }).then(async (res) => {
    if (res.status === 404) {
      return { info: { count: 0, pages: 1, next: null, prev: null }, results: [] };
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed ${res.status}`);
    }
    return res.json();
  });
}

const Index = () => {
  const [urlState, setURLState] = useURLState();
  const fav = useFavorites();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = "Resource Explorer — Rick and Morty";
  }, []);

  const query = useQuery({
    queryKey: [
      "characters",
      urlState.page,
      urlState.q,
      urlState.status,
      urlState.gender,
    ],
    queryFn: ({ signal }) =>
      fetchCharacters({
        page: urlState.page,
        q: urlState.q,
        status: urlState.status,
        gender: urlState.gender,
        signal,
      }),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const sortedFiltered = useMemo(() => {
    const data = query.data?.results || [];
    const filtered = urlState.fav
      ? data.filter((c) => fav.isFavorite(c.id))
      : data;

    const sorted = [...filtered].sort((a, b) => {
      switch (urlState.sort) {
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "created_asc":
          return new Date(a.created).getTime() - new Date(b.created).getTime();
        case "created_desc":
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case "name_asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return sorted;
  }, [query.data, urlState.sort, urlState.fav, fav]);

  const totalPages = query.data?.info.pages ?? 1;

  if (!mounted) {
    return null; // or return a loading skeleton if preferred
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl font-semibold">
            Resource Explorer
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setURLState({ fav: !urlState.fav, page: 1 })}
            >
              {urlState.fav ? "Showing Favorites" : "All Items"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Link to="#main" className="sr-only focus:not-sr-only">
              Skip to content
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="container mx-auto py-6 space-y-6">
        <section aria-labelledby="controls">
          <h2 id="controls" className="sr-only">
            Search and Filters
          </h2>
          <SearchFilterBar
            q={urlState.q}
            status={urlState.status}
            gender={urlState.gender}
            sort={urlState.sort}
            fav={urlState.fav}
            onChange={(u) => setURLState({ ...u, page: 1 })}
          />
        </section>

        <section aria-labelledby="results">
          <h2 id="results" className="sr-only">
            Results
          </h2>

          {query.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : query.isError ? (
            <Card className="p-6 text-center space-y-3">
              <p>We couldn't load characters. Please try again.</p>
              <Button onClick={() => query.refetch()}>Retry</Button>
            </Card>
          ) : sortedFiltered.length === 0 ? (
            <Card className="p-10 text-center">
              <p>No results found.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedFiltered.map((ch) => (
                <CharacterCard
                  key={ch.id}
                  character={ch}
                  isFavorite={fav.isFavorite(ch.id)}
                  onToggleFavorite={() => fav.toggle(ch.id)}
                />
              ))}
            </div>
          )}
        </section>

        <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
          <Button
            variant="secondary"
            onClick={() => setURLState({ page: Math.max(1, urlState.page - 1) })}
            disabled={urlState.page <= 1 || query.isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {urlState.page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setURLState({ page: Math.min(totalPages, urlState.page + 1) })}
            disabled={urlState.page >= totalPages || query.isLoading}
          >
            Next
          </Button>
        </nav>
      </main>

      <footer className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        Rick and Morty API • URL reflects state • Favorites stored locally
      </footer>
    </div>
  );
};

export default Index;