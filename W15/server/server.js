const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/products', (req, res) => {
    const dataPath = path.join(__dirname, 'data/products.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Product Catalog Server running at http://localhost:${PORT}`);
});
