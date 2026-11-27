import React from "react";

export default function SupportCard() {
  return (
    <div className="card" data-testid="support-card">
      <div className="card-header">
        <p className="card-title">Support</p>
      </div>
      <div className="helper" data-testid="support-text">
        Need help with a booking? Contact support@example.com.
      </div>
    </div>
  );
}
