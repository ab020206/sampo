const express = require('express');
const path = require('path');
const app = express();

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`W16 Static Website running at http://localhost:${PORT}`);
});
