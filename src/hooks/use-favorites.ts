import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "favorites:characters";

function readFromStorage(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set<number>();
    const arr = JSON.parse(raw) as number[];
    return new Set(arr);
  } catch {
    return new Set<number>();
  }
}

function writeToStorage(set: Set<number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(() => readFromStorage());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setFavorites(readFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const api = useMemo(
    () => ({
      list: () => Array.from(favorites),
      isFavorite: (id: number) => favorites.has(id),
      toggle: (id: number) => {
        const next = new Set(favorites);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setFavorites(next);
        writeToStorage(next);
      },
      clear: () => {
        const empty = new Set<number>();
        setFavorites(empty);
        writeToStorage(empty);
      },
    }),
    [favorites]
  );

  return api;
}
