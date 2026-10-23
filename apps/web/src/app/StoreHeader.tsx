import type { CampusStore } from "./useCampusStore";
import { StoreIcon } from "../shared/ui/StoreIcon";

type Props = Pick<CampusStore, "setView" | "quantity"> & {
  search: string;
  onSearch: (value: string) => void;
  onBag: () => void;
};

export function StoreHeader({ setView, quantity, search, onSearch, onBag }: Props) {
  return <header className="market-header">
    <a className="market-brand" href="#" onClick={() => setView("shop")} aria-label="UC Merced Campus Store home">
      <img src="/app-logo.png" alt="" width="44" height="44" />
      <span>Campus Store</span>
    </a>
    <label className="market-search">
      <StoreIcon name="search" />
      <span className="sr-only">Search all campus stores</span>
      <input type="search" placeholder="What are you craving?" value={search} onChange={event => onSearch(event.target.value)} />
    </label>
    <div className="market-location">
      <StoreIcon name="pin" /><span><small>CAMPUS DELIVERY</small>UC Merced</span>
    </div>
    <div className="market-header-actions">
      <button className="market-bag" onClick={onBag} aria-label={`View bag, ${quantity} ${quantity === 1 ? "item" : "items"}`}><StoreIcon name="bag" /><span>{quantity}</span></button>
    </div>
  </header>;
}
