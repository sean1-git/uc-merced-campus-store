import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";
import { useCampusStore } from "./useCampusStore";
import { usePwa } from "../shared/pwa/usePwa";
import { StoreHeader } from "./StoreHeader";
import { StoreSidebar } from "./StoreSidebar";
import { StoreHero } from "../features/storefront/StoreHero";
import { Storefront } from "../features/storefront/Storefront";
import { ShoppingBag } from "../features/checkout/ShoppingBag";
// Keep maps and order history out of the initial storefront download.
const OrderHistory = lazy(() => import("../features/orders/OrderHistory").then(module => ({ default: module.OrderHistory })));
const DeliveryLocation = lazy(() => import("../features/delivery/DeliveryMap").then(module => ({ default: module.DeliveryLocation })));
import { Bag } from "../shared/ui/BagIcon";
import { money } from "../shared/utils/money";
import { DeliveryStatus } from "../features/delivery/DeliveryStatus";
import { DeliveryCelebration } from "../features/delivery/DeliveryCelebration";
import "./App.css";
import "./MaterialEnhancements.css";
import "./Theme.css";
import "./Marketplace.css";

function focusBag() {
  const bag = document.getElementById("bag");
  bag?.focus({ preventScroll: true });
  bag?.scrollIntoView({ behavior: "auto", block: "start" });
}

export default function App() {
  const store = useCampusStore();
  const pwa = usePwa();
  const [search, setSearch] = useState("");
  const bagFocusPending = useRef(false);
  useLayoutEffect(() => {
    if (store.view === "shop" && bagFocusPending.current) {
      bagFocusPending.current = false;
      focusBag();
    }
  }, [store.view]);
  function showBag() {
    if (store.view === "shop") { focusBag(); return; }
    // Focus after React commits the shop; an animation frame can precede that commit.
    bagFocusPending.current = true;
    store.setView("shop");
  }
  function selectStore(id: string) {
    store.setStoreId(id);
    store.setFilter("All items");
    setSearch("");
    store.setView("shop");
  }
  const { view, online, locked, error, booting, notice, quantity, total, orderCooldownMs, nextOrderAt } =
    store;
  const { installHelp, setInstallHelp, update } = pwa;
  return (
    <div className="marketplace-app">
      <DeliveryCelebration orders={store.orders} />
      <a className="market-skip" href="#main-content">Skip to content</a>
      <StoreHeader {...store} search={search} onSearch={value => { setSearch(value); store.setView("shop"); }} onBag={showBag} />
      <StoreSidebar {...store} {...pwa} onStore={selectStore} />
      <main id="main-content" tabIndex={-1}>
        <div className="market-demo-note"><span>DEMO</span> Sample food, a simulated wallet & robot delivery. No real purchases.</div>
        {installHelp && (
          <div className="message">
            On iPhone: open this page in Safari, tap Share, then Add to Home
            Screen. On Android or desktop: use your browser’s Install app
            option. Installation needs HTTPS or localhost.
            <button
              onClick={() => setInstallHelp(false)}
              aria-label="Dismiss installation instructions"
            >
              ×
            </button>
          </div>
        )}
        {!online && (
          <div className="message warning" role="status">
            You’re offline. Browse your saved inventory and bag. Stock may have changed.
            Reconnect to reserve or confirm items. Existing checkout timers continue offline.
          </div>
        )}
        {update && (
          <div className="message">
            A new version is ready. Your bag will be kept.
            <button
              disabled={locked}
              onClick={() =>
                update.waiting?.postMessage({ type: "SKIP_WAITING" })
              }
            >
              Update app
            </button>
          </div>
        )}
        {error && view !== "map" && (
          <div className="message warning" role="alert">
            {error}
            <button onClick={() => void store.reconnect()} disabled={booting}>
              Reconnect
            </button>
          </div>
        )}
        {view !== "orders" && orderCooldownMs > 0 && nextOrderAt && <DeliveryStatus {...store} />}
        <div className={notice ? "message" : "sr-only"} role="status" aria-live="polite">
          {notice}
        </div>
        {view !== "map" && <details className="inventory-disclosure">
          <summary><span className={`connection-dot${online ? "" : " offline"}`} />{online ? "Online browsing" : "Offline browsing"} <span>Inventory & sync details</span></summary>
          <div>
            {store.inventoryFetchedAt
              ? <>Catalog last fetched by this browser: {new Date(store.inventoryFetchedAt).toLocaleString()}.</>
              : "Sample menu only · no saved catalog response yet."}
            {" "}Catalog refreshes every 15 minutes while online. This is not the time stock last changed.
            {" "}Source stock-change and sync times are shown per item. Checkout always checks current stock.
            {store.inventoryUnavailable && " The latest refresh failed; showing your last saved snapshot."}
            {store.lastApiSuccessAt && <div>Last successful server contact: {new Date(store.lastApiSuccessAt).toLocaleString()}.</div>}
          </div>
        </details>}
        <Suspense fallback={<p role="status">Loading your campus view…</p>}>
        {view === "map" ? (
          <DeliveryLocation {...store} destination={store.reservation?.body.destination ?? store.pending?.body.destination ?? store.destination} />
        ) : view === "shop" ? (
          <>
          <div className="market-welcome"><div><p className="market-eyebrow">UC MERCED · CAMPUS STORE</p><h2>Hey Bobcat, what sounds good?</h2></div><span>Built for the space between classes.</span></div>
          <div className="market-categories" aria-label="Quick food categories">
            {[["All items", "🛍️", "Everything"], ["Lunch", "🥪", "Lunch break"], ["Drinks", "🧋", "Sip & study"], ["Snacks", "🍪", "Snack time"]].map(([value, icon, label]) => <button key={value} aria-pressed={store.filter === value} onClick={() => store.setFilter(value)}><span aria-hidden="true">{icon}</span>{label}</button>)}
          </div>
          <StoreHero catalog={store.catalog} />
          <div className="shop-layout">
            <Storefront catalog={store.catalog} filter={store.filter} setFilter={store.setFilter}
              cart={store.cart} locked={store.locked} change={store.change}
              storeId={store.storeId} onStore={selectStore} search={search} setSearch={setSearch} />
            <ShoppingBag {...store} />
          </div>
          </>
        ) : (
          <OrderHistory {...store} />
        )}
        </Suspense>
      </main>
      {view === "shop" && quantity > 0 && (
        <a className="mobile-bag" href="#bag">
          <span>
            <Bag size={20} /> View bag · {quantity}{" "}
            {quantity === 1 ? "item" : "items"}
          </span>
          <strong>{money(total)}</strong>
        </a>
      )}
      <footer>
        <div className="ucm-footer-brand"><img src="/uc-merced-seal.png" alt="University of California, Merced seal" width="64" height="64" loading="lazy" decoding="async" /><div><strong>University of California, Merced</strong><p>Campus Store · Built for the space between classes.</p></div></div>
        <span>Prototype · Simulated integrations</span>
      </footer>
    </div>
  );
}
