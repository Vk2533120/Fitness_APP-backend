const express = require('express');
require('dotenv').config(); // This should be enough, dotenv is only needed once
// const dotenv = require('dotenv'); // Not needed if already called with require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const classRoutes = require('./routes/classRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes'); 
const path = require('path');

// dotenv.config(); // This is redundant if already using require('dotenv').config() above

connectDB();

const app = express();

// ONLY USE THIS ONE CORS CONFIGURATION:
app.use(cors({
    origin: ['http://localhost:5173', 'https://fitness123app.netlify.app'], // <--- ADD YOUR NETLIFY URL HERE
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // This should typically come after CORS, but before routes


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/feedback', feedbackRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Root route
app.get('/', (req, res) => {
    res.send('Fitness Booking API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));