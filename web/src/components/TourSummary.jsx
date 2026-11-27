import React from "react";
import { formatUSD } from "../lib/format.js";
import { TOURS } from "../data/tours.js";

export default function TourSummary() {
  return (
    <div className="card" data-testid="tour-summary-card">
      <div className="card-header">
        <p className="card-title">Tour Summary</p>
      </div>
      <ul className="plain-list" data-testid="tour-summary-list">
        {TOURS.map((t) => (
          <li key={t.id} data-testid="tour-summary-item">
            <b>{t.name}</b> &middot; {t.durationDays}d &middot; {formatUSD(t.priceUsd)} / person
          </li>
        ))}
      </ul>
    </div>
  );
}
