export async function getBookings() {
  const res = await fetch("/api/bookings");
  if (!res.ok) {
    throw new Error(`Failed to fetch bookings (${res.status})`);
  }
  const json = await res.json();
  return json.bookings || [];
}

export async function createBooking(body) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || "Unable to create booking");
  }

  return json.booking;
}
