const STORAGE_KEY = "talent-market:scraps";

export function getScrapIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function isScraped(id: string): boolean {
  return getScrapIds().includes(id);
}

export function toggleScrap(id: string): boolean {
  const ids = getScrapIds();
  const exists = ids.includes(id);
  const next = exists ? ids.filter((v) => v !== id) : [...ids, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return !exists;
}

export function getScrapCount(): number {
  return getScrapIds().length;
}
