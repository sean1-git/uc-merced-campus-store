import { memo, useState } from "react";
import { money } from "../../shared/utils/money";
import { inventoryFreshnessLabel } from "./inventoryFreshness";
import type { CampusStore } from "../../app/useCampusStore";
import { stores, storeName } from "../../../../../packages/domain/src/catalog/stores";
import { StoreIcon } from "../../shared/ui/StoreIcon";

type Props = Pick<CampusStore, "catalog" | "filter" | "setFilter" | "cart" | "locked" | "change" | "storeId"> & {
  onStore: (id: string) => void;
  search: string;
  setSearch: (value: string) => void;
};

export const Storefront = memo(function Storefront({ catalog, filter, setFilter, cart, locked, change, storeId, onStore, search, setSearch }: Props) {
  const [sort, setSort] = useState("featured");
  const [underFive, setUnderFive] = useState(false);
  const [inStock, setInStock] = useState(false);
  const query = search.trim().toLowerCase();
  const selectedStore = stores.find(store => store.id === storeId)!;
  // A header search spans both stores; browsing without a query keeps the selected shop.
  const visibleProducts = catalog.products.filter(p =>
    (query || p.storeId === storeId) && (filter === "All items" || p.category === filter)
    && `${p.name} ${p.description} ${p.category} ${storeName(p.storeId)}`.toLowerCase().includes(query)
    && (!underFive || p.priceCents < 500) && (!inStock || (p.stock ?? 0) > 0))
    .sort((a, b) => sort === "price-low" ? a.priceCents - b.priceCents : sort === "price-high" ? b.priceCents - a.priceCents : 0);

  function clearFilters() { setSearch(""); setFilter("All items"); setUnderFive(false); setInStock(false); setSort("featured"); }

  return <section className="storefront market-storefront" data-store={storeId}>
    <div className="market-section-title" id="campus-shops"><h2>Your campus shops</h2><span>Two local stops. Plenty to love.</span></div>
    <div className="market-shop-cards" role="tablist" aria-label="Campus stores">
      {stores.map((shop, index) => <button className="market-shop-card" key={shop.id} role="tab" id={`store-tab-${shop.id}`}
        aria-selected={storeId === shop.id} aria-controls="store-inventory" tabIndex={storeId === shop.id ? 0 : -1}
        onClick={() => onStore(shop.id)} onKeyDown={event => {
          const next = event.key === "Home" ? 0 : event.key === "End" ? stores.length - 1
            : event.key === "ArrowRight" ? (index + 1) % stores.length : event.key === "ArrowLeft" ? (index + stores.length - 1) % stores.length : -1;
          if (next < 0) return;
          event.preventDefault(); onStore(stores[next].id);
          document.getElementById(`store-tab-${stores[next].id}`)?.focus();
        }}>
        <div className="market-shop-photo"><img src={shop.image} alt="" width="500" height="180" loading="lazy" decoding="async" />
          <span>{storeId === shop.id ? "✓ Selected shop" : "Explore shop"}</span></div>
        <div className="market-shop-info"><strong>{shop.name}</strong><StoreIcon name="arrow" size={18} /><small>{shop.id === "summits" ? "Scholars Lane" : "Kolligian Library"} · {catalog.products.filter(p => p.storeId === shop.id).length} sample favorites</small></div>
      </button>)}
    </div>
    <div className="inventory-panel" id="store-inventory" role="tabpanel" aria-labelledby={query ? "market-menu-title" : `store-tab-${storeId}`}>
      <div className="market-section-title menu-title"><div><p className="market-eyebrow">{query ? "BOTH CAMPUS STORES" : selectedStore.name}</p><h2 id="market-menu-title">{query ? "Find your next favorite" : filter === "All items" ? "A little something for you" : filter === "Lunch" ? "Make it a lunch break" : filter === "Drinks" ? "Your next study sip" : "Small bites. Big mood."}</h2></div><span className="result-count" role="status">{visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}</span></div>
      {query && <p className="market-query">Results for “{search.trim()}” <button onClick={() => setSearch("")}>Clear search ×</button></p>}
      <div className="market-filter-bar" aria-label="Menu filters">
        <button aria-pressed={underFive} onClick={() => setUnderFive(value => !value)}>Under $5</button>
        <button aria-pressed={inStock} onClick={() => setInStock(value => !value)}>In stock</button>
        <label><span className="sr-only">Sort menu</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Sort: Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
        {(filter !== "All items" || underFive || inStock || query) && <button className="market-reset" onClick={clearFilters}>Reset filters</button>}
      </div>
      <div className="products">
        {visibleProducts.map(p => <article className={`product${cart[p.id] ? " product-in-bag" : ""}`} key={p.id}>
          <div className="product-art" style={{ backgroundColor: p.color }}>
            <span className="product-tag">{p.tag}</span>
            <span className="food" role="img" aria-label={p.name}>{p.emoji}</span>
            {cart[p.id] > 0 && <span className="in-bag-pill">{cart[p.id]} in your bag</span>}
          </div>
          <div className="product-details">
            <div className="product-category">{p.category}</div>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p className="pickup-chip">{storeName(p.storeId)}</p>
            <details className="product-stock-details"><summary>{p.stock === undefined ? "Connect to check stock" : p.stock === 0 ? "Sold out" : `${p.stock} left · inventory details`}</summary><p>{inventoryFreshnessLabel(p)}</p></details>
            <div className="product-bottom"><strong>{money(p.priceCents)}</strong>
              <button disabled={locked || (cart[p.id] || 0) >= Math.min(20, p.stock ?? 20)} className="add" onClick={() => change(p, 1)} aria-label={`Add ${p.name} to bag`}>{p.stock === 0 ? "Sold out" : "Add +"}<span className="sr-only">{cart[p.id] ? `, ${cart[p.id]} already in bag` : ""}</span></button>
            </div>
          </div>
        </article>)}
      </div>
      {visibleProducts.length === 0 && <div className="menu-empty"><StoreIcon name="search" size={30} /><h3>No bites found</h3><p>Try another search or reset your filters.</p><button className="back" onClick={clearFilters}>Show all items</button></div>}
    </div>
    <p className="menu-note">Illustrative menu and prices. School inventory is not connected yet. Stock is confirmed at checkout; adding to your bag does not reserve an item.</p>
  </section>;
});
