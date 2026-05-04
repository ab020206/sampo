const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/users.json');

const getUsers = () => JSON.parse(fs.readFileSync(DATA_PATH));
const saveUsers = (users) => fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));

// Register
router.post('/register', (req, res) => {
    try {
        const { name, email, mobile, dob, city, address, password } = req.body;
        const users = getUsers();
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = { id: Date.now(), name, email, mobile, dob, city, address, password };
        users.push(newUser);
        saveUsers(users);
        res.status(201).json({ message: 'Registration successful', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
