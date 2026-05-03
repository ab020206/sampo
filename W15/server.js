const http = require('http');
const fs = require('fs');
const path = require('path');

// Node.js Product API
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/api/products' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'products.json');
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: "Failed to load products" }));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not found. Try /api/products" }));
    }
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Product API running at http://localhost:${PORT}/api/products`);
});
