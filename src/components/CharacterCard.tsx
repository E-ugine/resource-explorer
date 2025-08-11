import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Character } from "@/types/rm";
import { Heart } from "lucide-react";

interface Props {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const statusVariant: Record<string, string> = {
  Alive: "default",
  Dead: "destructive",
  unknown: "secondary",
};

export default function CharacterCard({ character, isFavorite, onToggleFavorite }: Props) {
  const sVar = statusVariant[character.status] ?? "secondary";
  return (
    <Card className="p-4 group transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex gap-4">
        <Link to={`/items/${character.id}`} className="shrink-0 focus:outline-none">
          <img
            src={character.image}
            alt={`${character.name} — ${character.status} ${character.species}`}
            loading="lazy"
            className="h-24 w-24 rounded-md object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium truncate">
              <Link to={`/items/${character.id}`} className="hover:underline">
                {character.name}
              </Link>
            </h3>
            <Button variant="ghost" size="icon" aria-label="Toggle favorite" onClick={onToggleFavorite}>
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant={sVar as any}>{character.status}</Badge>
            <Badge variant="outline">{character.species}</Badge>
            <Badge variant="outline">{character.gender}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground truncate">Last seen: {character.location?.name}</p>
        </div>
      </div>
    </Card>
  );
}
