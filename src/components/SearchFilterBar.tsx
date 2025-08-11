import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  q: string;
  status: string;
  gender: string;
  sort: string;
  fav: boolean;
  onChange: (u: Partial<{ q: string; status: string; gender: string; sort: string; fav: boolean }>) => void;
}

export default function SearchFilterBar({ q, status, gender, sort, fav, onChange }: Props) {
  const [search, setSearch] = useState(q);

  useEffect(() => setSearch(q), [q]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== q) onChange({ q: search });
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(v) => onChange({ status: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="alive">Alive</SelectItem>
            <SelectItem value="dead">Dead</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Gender</Label>
        <Select value={gender} onValueChange={(v) => onChange({ gender: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="genderless">Genderless</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Sort</Label>
        <Select value={sort} onValueChange={(v) => onChange({ sort: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name A→Z</SelectItem>
            <SelectItem value="name_desc">Name Z→A</SelectItem>
            <SelectItem value="created_desc">Newest</SelectItem>
            <SelectItem value="created_asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2 lg:col-span-4 flex items-center gap-3">
        <Switch id="fav" checked={fav} onCheckedChange={(v) => onChange({ fav: v })} />
        <Label htmlFor="fav">Show favorites only</Label>
      </div>
    </div>
  );
}
