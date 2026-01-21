const Booking = require("../models/Booking");
const Room = require("../models/Room");
const mongoose = require("mongoose");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      firstName,
      lastName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      adults,
      children,
      roomType
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      firstName,
      lastName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      adults,
      children,
      roomType,
      status: "pending"
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);
    res.status(500).json({ message: error.message || "Booking failed" });
  }
};

// GET USER BOOKINGS
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room");

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};

// USER CANCEL BOOKING
const cancelBookingByUser = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
  console.log("AUTH HEADER:", req.headers.authorization);
console.log("USER:", req.user);

};

// ADMIN / STAFF
const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("user")
    .populate("room");
  res.status(200).json(bookings);
};

const getPendingBookings = async (req, res) => {
  const bookings = await Booking.find({ status: "pending" })
    .populate("user")
    .populate("room");
  res.status(200).json(bookings);
};

const updateBookingStatus = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.status(200).json(booking);
};

const deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Booking deleted" });
};

module.exports = {
  createBooking,
  getAllBookings,
  getPendingBookings,
  getUserBookings,
  updateBookingStatus,
  cancelBookingByUser,
  deleteBooking
};
