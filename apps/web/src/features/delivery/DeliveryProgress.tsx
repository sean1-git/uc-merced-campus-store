import { useEffect, useState } from "react";

// Lazy registration avoids downloading the progress component during idle browsing.
export function DeliveryProgress({ value, label }: { value: number; label: string }) {
  const [ready, setReady] = useState(() => !!customElements.get("md-linear-progress"));
  useEffect(() => {
    let active = true;
    void import("@material/web/progress/linear-progress.js")
      .then(() => { if (active) setReady(true); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return ready ? <md-linear-progress value={value} aria-label={label} />
    : <progress className="delivery-progress-fallback" max={1} value={value} aria-label={label} />;
}
