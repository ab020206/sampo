const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/employees', (req, res) => {
    const dataPath = path.join(__dirname, 'data/employees.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Employee Directory Server running at http://localhost:${PORT}`);
});
