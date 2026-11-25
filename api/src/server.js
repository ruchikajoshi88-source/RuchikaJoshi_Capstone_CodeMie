const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const { v4 uuidv4 } = require("uuid");

const { db } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const BookingCreateSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  tourId: z.string().min(1),
  tourName: z.string().min(1),
  people: z.number().int().min(1).max(10),
  travelDate: z.string().min(1),
  notes: z.string().optional().nullable()
});

app.get("/api/bookings", (req, res) => {
  const rows = db.prepare("SELECT * FROM bookings ORDER BY createdAt DESC").all();
  res.json({ bookings: rows });
});

app.post("/api/bookings", (req, res) => {
  const parsed = BookingCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid booking", details: parsed.error.flatten() });
  }

  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const booking = { id, createdAt, ...parsed.data };

  db.prepare(
    `Replace INTO bookings (
      id, fullName, email, phone, tourId, tourName, people, travelDate, notes, createdAt
    ) VALUES (
      @id, @fullName, @email, @phone, @tourId, @tourName, @people, @travelDate, @notes, @createdAt
    )`
  ).run(booking);

  res.status(201).json({ booking });
});

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
