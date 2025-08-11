import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import type { Character } from "@/types/rm";

const API_BASE = "https://rickandmortyapi.com/api";

export default function CharacterDetail() {
  const { id } = useParams();
  const fav = useFavorites();

  const query = useQuery({
    queryKey: ["character", id],
    queryFn: ({ signal }) =>
      fetch(`${API_BASE}/character/${id}`, { signal }).then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      }),
  });

  if (query.isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 flex gap-6">
          <Skeleton className="h-48 w-48 rounded-md" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </Card>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center space-y-4">
          <p>We couldn’t load this character.</p>
          <Button onClick={() => query.refetch()}>Retry</Button>
        </Card>
      </div>
    );
  }

  const c = query.data as Character;
  const isFav = fav.isFavorite(c.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.name,
    image: c.image,
    gender: c.gender,
    description: `${c.status} ${c.species}`,
  };

  return (
    <div className="container mx-auto py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="grid gap-6 md:grid-cols-[auto,1fr]">
        <img
          src={c.image}
          alt={`${c.name} — ${c.status} ${c.species}`}
          loading="eager"
          className="h-56 w-56 rounded-md object-cover"
        />
        <div className="space-y-4">
          <header className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-semibold">{c.name}</h1>
            <Button variant="secondary" onClick={() => fav.toggle(c.id)}>
              {isFav ? "Remove favorite" : "Add to favorites"}
            </Button>
          </header>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{c.status}</Badge>
            <Badge variant="outline">{c.species}</Badge>
            {c.type && <Badge variant="outline">{c.type}</Badge>}
            <Badge variant="outline">{c.gender}</Badge>
          </div>
          <section className="space-y-1">
            <p className="text-sm text-muted-foreground">Origin: {c.origin?.name}</p>
            <p className="text-sm text-muted-foreground">Last known location: {c.location?.name}</p>
            <p className="text-sm text-muted-foreground">Episodes: {c.episode?.length}</p>
          </section>
          <nav>
            <a href="/" className="underline">← Back to list</a>
          </nav>
        </div>
      </article>
    </div>
  );
}
