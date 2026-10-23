type IconName = "home" | "pin" | "orders" | "search" | "bag" | "arrow" | "download";

export function StoreIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, string> = {
    home: "M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9",
    pin: "M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    orders: "M6 3h12v18l-3-2-3 2-3-2-3 2V3ZM9 8h6M9 12h6",
    search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
    bag: "M5 7h14l2 14H3L5 7ZM8 8V6a4 4 0 0 1 8 0v2",
    arrow: "M4 12h16m-6-6 6 6-6 6",
    download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
