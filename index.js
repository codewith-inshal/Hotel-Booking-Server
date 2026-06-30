require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const cors = require("cors");
const path = require("path");

const roomRouter = require("./routes/room");
const staffRouter = require("./routes/staff");
const adminRouter = require("./routes/admin");
const contactRouter = require("./routes/contact");
const bookingRouter = require("./routes/booking");
const userRouter = require("./routes/user");

const port = process.env.PORT || 5000;

// DB
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-client-chi.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => {
  res.send("Hotel booking API is running");
});

app.use("/api/user", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api", contactRouter);
app.use("/api/staff", staffRouter);
app.use("/api/admin", adminRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
