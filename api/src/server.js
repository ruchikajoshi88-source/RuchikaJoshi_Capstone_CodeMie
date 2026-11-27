const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const { v4: uuidv4 } = require("uuid");

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
  const rows = db.prepare("SELECT * FROM bookings ORDER BY created_at DESC, id DESC").all();
  res.status(200).json({ bookings: rows });
});

app.post("/api/bookings", (req, res) => {
  const parsed = BookingCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid booking", details: parsed.error.flatten() });
  }

  const booking = {
    id: uuidv4(),
    created_at: new Date().toISOString(),
    phone: null,
    notes: null,
    ...parsed.data
  };

  db.prepare(
    `INSERT INTO bookings (
      id, fullName, email, phone, tourId, tourName, people, travelDate, notes, created_at
    ) VALUES (
      @id, @fullName, @email, @phone, @tourId, @tourName, @people, @travelDate, @notes, @created_at
    )`
  ).run(booking);

  res.status(201).json({ booking });
});

// Serve the built web UI from the same origin as the API.
const webDist = path.join(__dirname, "..", "..", "web", "dist");
if (fs.existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(webDist, "index.html"));
  });
}

const PORT = process.env.PORT || 5173;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

module.exports = { app };
