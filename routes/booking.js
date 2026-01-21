const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getPendingBookings,
  getUserBookings,
  updateBookingStatus,
  cancelBookingByUser,
  deleteBooking
} = require("../controllers/booking");

const protect = require("../middleware/authMiddleware");

// USER
router.post("/book-room", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);
router.patch("/:bookingId/cancel", protect, cancelBookingByUser);

// ADMIN / STAFF
router.get("/", getAllBookings);
router.get("/pending", getPendingBookings);
router.patch("/:id", updateBookingStatus);
router.delete("/:id", deleteBooking);

module.exports = router;
