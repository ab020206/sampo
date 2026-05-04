const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentClub')
    .then(() => console.log('Connected to studentClub DB'))
    .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    dob: String,
    city: String,
    address: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, dob, city, address, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new User({ name, email, mobile, dob, city, address, password });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
