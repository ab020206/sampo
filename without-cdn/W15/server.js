const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// API Route
app.get('/api/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.json'));
});

// Serve Static Files
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`W15 Product API running at http://localhost:${PORT}`);
});