require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const cors = require('cors');
const path = require('path');

const roomRouter = require('./routes/room');
const staffRouter = require('./routes/staff');
const adminRouter = require('./routes/admin');
const contactRouter = require('./routes/contact');
const bookingRouter = require('./routes/booking');
const userRouter = require('./routes/user');

const port = process.env.PORT || 5000;

// DB
connectDB();

// Middleware
app.use(cors({ origin: 'https://hotel-booking-client-chi.vercel.app' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/user', userRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/contact', contactRouter);
app.use('/api/staff', staffRouter);
app.use('/api/admin', adminRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
