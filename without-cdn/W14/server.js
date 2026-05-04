const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// API Route
app.get('/api/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'users.json'));
});

// Serve Static Files
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`W14 User Directory Server running at http://localhost:${PORT}`);
});

