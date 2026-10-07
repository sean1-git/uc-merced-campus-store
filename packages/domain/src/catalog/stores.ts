// Keep pickup IDs stable: changing "library" would break saved Bobcat orders
// and the product-to-store link.
export const stores = [
  { id: "summits", name: "The Summit's Marketplace", icon: "🛒", image: "/summit-marketplace.jpg", description: "Everyday bites, refreshing drinks & late-study essentials." },
  { id: "library", name: "Bobcat's Snack shop", icon: "🐾", image: "/bobcat-snack-shop.jpg", description: "Library study fuel, quick lunches & a little something sweet." },
];
export const storeName = (id: string) => stores.find(store => store.id === id)?.name ?? "Campus store";
