const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple Node.js Server
const server = http.createServer((req, res) => {
    // Enable CORS for frontend access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // API Endpoint: /api/users
    if (req.url === '/api/users' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'users.json');
        
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error: Could not read user data.');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(content);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Endpoint Not Found. Use /api/users');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/api/users`);
});
