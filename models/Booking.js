const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    roomType: {
      type: String,
      enum: ['presidential', 'vip', 'executive', 'double'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
