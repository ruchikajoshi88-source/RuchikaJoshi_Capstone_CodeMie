import React from "react";

export default function BookingsSummary({ bookings, onRefresh }) {
  return (
    <div className="card" data-testid="bookings-summary-card">
      <div className="card-header">
        <p className="card-title">Booking Summary</p>
        <button type="button" className="btn" onClick={onRefresh} data-testid="refresh-bookings-button">
          Refresh
        </button>
      </div>

      <table className="table" data-testid="bookings-table">
        <thead>
          <tr>
            <th>Tour</th>
            <th>Travel date</th>
            <th>People</th>
            <th>Name</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="5" className="helper" data-testid="bookings-empty">
                No bookings yet. Submit the form to create one.
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id} data-testid="booking-row">
                <td>{b.tourName}</td>
                <td>{b.travelDate}</td>
                <td>{b.people}</td>
                <td>{b.fullName}</td>
                <td>{new Date(b.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}