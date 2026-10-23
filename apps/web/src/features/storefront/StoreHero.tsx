import { memo } from "react";
import type { CampusStore } from "../../app/useCampusStore";
import { money } from "../../shared/utils/money";
import { StoreIcon } from "../../shared/ui/StoreIcon";

export const StoreHero = memo(function StoreHero({ catalog }: Pick<CampusStore, "catalog">) {
  return <section className="market-promos" aria-label="Campus delivery">
    <div className="campus-promo">
      <div className="campus-promo-copy">
        <p className="market-eyebrow">THE CAMPUS, AT YOUR DOORSTEP</p>
        <h1>Small cravings.<br /><em>Big campus energy.</em></h1>
        <p>Your study snacks. Your favorite bites.<br />A little robot to bring them over.</p>
        <a className="promo-browse" href="#campus-shops">Explore the menu <StoreIcon name="arrow" size={18} /></a>
      </div>
      <div className="campus-promo-art" aria-hidden="true"><span className="promo-orbit" /><span className="promo-snack">🥪</span><img src="/delivery-robot.svg" alt="" width="240" height="200" /><span className="robot-label">YOUR CAMPUS CO-PILOT</span></div>
    </div>
    <div className="campus-side-promo">
      <p className="market-eyebrow">BETWEEN CLASSES, SORTED.</p>
      <h2>Two shops.<br />One happy bag.</h2>
      <p>Mix your favorites from both campus stores in a single delivery.</p>
      <div className="promo-fee"><strong>{money(catalog.deliveryFeeCents)}</strong><span>simulated<br />robot delivery</span><StoreIcon name="bag" size={30} /></div>
    </div>
  </section>;
});
