const express = require('express');
const path = require('path');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/employees', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Employee Management Server running at http://localhost:${PORT}`);
});
