const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api/products') {
        fs.readFile(path.join(__dirname, 'products.json'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading JSON');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(content);
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`W15 Product API running at http://localhost:${PORT}`);
});
