import sampleCatalog from "../../../../../packages/domain/src/catalog/catalog.json";
import type { Cart } from "../types";
import { persistValue } from "./persistValue";

export function load<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export function save(key: string, value: unknown) {
  try {
    persistValue(localStorage, key, value);
  } catch {
    /* The app still works without browser storage. */
  }
}
// Saved browser data can be stale or edited; restore only known products and
// bounded quantities before letting it reach the checkout UI.
export function initialCart(): Cart {
  const stored = load<unknown>("campus-cart", {});
  if (!stored || typeof stored !== "object") return {};
  return Object.fromEntries(
    sampleCatalog.products.map((p) => [
      p.id,
      Math.min(
        20,
        Math.max(0, Math.floor(Number((stored as Cart)[p.id]) || 0)),
      ),
    ]),
  );
}
