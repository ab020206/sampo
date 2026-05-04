const express = require('express');
const path = require('path');
const app = express();
const PORT = 3003;

// API Route
app.get('/api/employees', (req, res) => {
    res.sendFile(path.join(__dirname, 'employees.json'));
});

// Serve Static Files
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`W17 Employee Directory Server running at http://localhost:${PORT}`);
});

