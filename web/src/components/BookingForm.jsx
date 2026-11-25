import React, { useMemo, useState } from "react";
import { createBooking } from "../lib/api.js";
import { formatUSD, toDateInputValue } from "../lib/format.js";
import { TOURS } from "../data/tours.js";

function Field({ id, label, children }) {
  return (
    <div style={{ margin: "0 0 12px" }}>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function BookingForm({ onCreated }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    tourId: TOURS[0].id,
    people: 2,
    travelDate: toDateInputValue(new Date()),
    notes: "",
  });

  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const selectedTour = useMemo(
    () => TOURS.find((t) => t.id === form.tourId) || TOURS[0],
    [form.tourId]
  );

  const totalPrice = useMemo(
    () => selectedTour.priceUsd * Number(form.people || 0),
    [selectedTour, form.people]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: false });

    try {
      await createBooking({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        tourId: form.tourId,
        tourName: selectedTour.name,
        people: Number(form.people),
        travelDate: form.travelDate,
        notes: form.notes.trim() || null,
      });

      setStatus({ loading: false, error: "", success: true });
      await onCreated?.();
      setForm((prev) => ({ ...prev, notes: "" }));
    } catch (err) {
      setStatus({ loading: false, error: err?.message || "Unexpected error", success: false });
    }
  };

  return (
    <div className="card" data-testid="tour-selection-card">
      <div className="card-header">
        <p className="card-title">Book a Tour</p>
      </div>

      <form onSubmit={onSubmit} data-testid="booking-form">
        <div className="row">
          <Field id="fullName" label="Full name">
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="Jane Doe"
              data-testid="input-full-name"
            />
          </Field>

          <Field id="email" label="Email">
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="jane@example.com"
              data-testid="input-email"
            />
          </Field>
        </div>

        <div className="row">
          <Field id="phone" label="Phone (optional)">
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="+1 (555) 012-3456"
              data-testid="input-phone"
            />
          </Field>

          <Field id="people" label="People">
            <input
              id="people"
              name="people"
              type="number"
              min="1"
              max="10"
              value={form.people}
              onChange={onChange}
              data-testid="input-people"
            />
          </Field>
        </div>

        <div className="row">
          <Field id="tourId" label="Tour">
            <select id="tourId" name="tourId" value={form.tourId} onChange={onChange} data-testid="select-tour">
              {TOURS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.durationDays}d)
                </option>
              ))}
            </select>
          </Field>

          <Field id="travelDate" label="Travel date">
            <input
              id="travelDate"
              name="travelDate"
              type="date"
              value={form.travelDate}
              onChange={onChange}
              data-testid="input-travel-date"
            />
          </Field>
        </div>

        <Field id="notes" label="Notes (optional)">
          <textarea id="notes" name="notes" value={form.notes} onChange={onChange} data-testid="input-notes" />
        </Field>

        <div className="row">
          <div>
            <div className="helper" data-testid="price-summary">
              Total: <b>{formatUSD(totalPrice)}</b>
            </div>
            <div className="helper" data-testid="price-helper">
              Price: {formatUSD(selectedTour.priceUsd)} per person
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary" disabled={status.loading} data-testid="book-tour-submit">
              {status.loading ? "Booking..." : "Book now"}
            </button>
          </div>
        </div>

        {status.error ? (
          <div className="error" data-testid="booking-form-error">
            {status.error}
          </div>
        ) : null}

        {status.success ? (
          <div className="helper" data-testid="booking-success">
            Booking saved to SQLite.
          </div>
        ) : null}
      </form>
    </div>
  );
}