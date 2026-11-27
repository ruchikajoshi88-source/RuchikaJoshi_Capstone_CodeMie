import React, { useCallback, useEffect, useState } from "react";
import BookingForm from "./components/BookingForm.jsx";
import BookingsSummary from "./components/BookingsSummary.jsx";
import DownloadBrochureCard from "./components/DownloadBrochureCard.jsx";
import TourSummary from "./components/TourSummary.jsx";
import SupportCard from "./components/SupportCard.jsx";
import { getBookings } from "./lib/api.js";

export default function App() {
  const [bookings, setBookings] = useState([]);

  const refresh = useCallback(async () => {
    const list = await getBookings();
    setBookings(list);
  }, []);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  return (
    <div className="container" data-testid="app-container">
      <div className="header">
        <div>
          <h1 className="h1" data-testid="app-title">Tour Booking & Summary</h1>
          <p className="subhead">In-browser demo UI with SQLite persistence</p>
        </div>
        <div className="badge" data-testid="badge-api-status">
          API: /api
        </div>
      </div>

      <div className="layout">
        <div className="column" data-testid="left-column">
          <BookingForm onCreated={refresh} />
          <BookingsSummary bookings={bookings} onRefresh={refresh} />
        </div>

        <div className="column" data-testid="right-column">
          <TourSummary />
          <DownloadBrochureCard />
          <SupportCard />
        </div>
      </div>
    </div>
  );
}
