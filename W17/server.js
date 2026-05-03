const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// API Endpoint
app.get('/api/employees', (req, res) => {
    fs.readFile(path.join(__dirname, 'employees.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error reading data");
        res.json(JSON.parse(data));
    });
});

// Serve Frontend
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Employee Directory</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-light p-5">
            <div class="container bg-white p-5 rounded shadow">
                <h1 class="mb-4">Staff Directory</h1>
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr><th>Name</th><th>Department</th><th>Email</th><th>City</th></tr>
                    </thead>
                    <tbody id="data"></tbody>
                </table>
            </div>
            <script>
                fetch('/api/employees')
                    .then(res => res.json())
                    .then(users => {
                        const html = users.map(u => '<tr><td>'+u.name+'</td><td>'+u.dept+'</td><td>'+u.email+'</td><td>'+u.city+'</td></tr>').join('');
                        document.getElementById('data').innerHTML = html;
                    });
            </script>
        </body>
        </html>
    `);
});

app.listen(3000, () => console.log('Employee Directory running at http://localhost:3000'));
