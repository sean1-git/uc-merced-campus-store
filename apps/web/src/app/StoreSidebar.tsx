import type { CampusStore } from "./useCampusStore";
import type { PwaControls } from "../shared/pwa/usePwa";
import { money } from "../shared/utils/money";
import { StoreIcon } from "../shared/ui/StoreIcon";
import { stores } from "../../../../packages/domain/src/catalog/stores";

type Props = Pick<CampusStore, "view" | "setView" | "activeOrders" | "session" | "storeId"> &
  Pick<PwaControls, "installed" | "install"> & { onStore: (id: string) => void };

export function StoreSidebar({ view, setView, activeOrders, session, storeId, onStore, installed, install }: Props) {
  return <aside className="market-sidebar" aria-label="Campus store navigation">
    <nav className="market-nav" aria-label="Main navigation">
      <button aria-current={view === "shop" ? "page" : undefined} onClick={() => setView("shop")}><StoreIcon name="home" /><span>The store</span></button>
      <button aria-current={view === "orders" ? "page" : undefined} onClick={() => setView("orders")}><StoreIcon name="orders" /><span>My orders</span>{activeOrders > 0 && <b className="market-count">{activeOrders}</b>}</button>
      <button aria-current={view === "map" ? "page" : undefined} onClick={() => setView("map")}><StoreIcon name="pin" /><span>Campus map</span></button>
    </nav>
    <div className="sidebar-shops">
      <p className="sidebar-label">YOUR CAMPUS STORES</p>
      {stores.map(shop => <button key={shop.id} onClick={() => onStore(shop.id)} aria-pressed={view === "shop" && storeId === shop.id}>
        <img src={shop.image} alt="" width="36" height="36" /><span>{shop.name}</span>
      </button>)}
    </div>
    <div className="sidebar-bottom">
      <div className="sidebar-wallet"><span>Demo wallet</span><strong>{session ? money(session.balanceCents) : "—"}</strong><small>Try it out. No real charges.</small></div>
      {!installed && <button className="sidebar-install" aria-label="Install app" onClick={() => void install()}><StoreIcon name="download" /><span>Install app</span></button>}
      <p className="sidebar-signoff">A little less walking.<br />A little more campus life.</p>
    </div>
  </aside>;
}
