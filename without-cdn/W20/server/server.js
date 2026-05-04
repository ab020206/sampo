const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/employeeDB')
    .then(() => console.log('Connected to employeeDB'))
    .catch(err => console.error(err));

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    position: String,
    salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

// API Routes (using app.get, app.post, etc. directly)

// GET all
app.get('/api/employees', async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
});

// POST add
app.post('/api/employees', async (req, res) => {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
});

// PUT update
app.put('/api/employees/:id', async (req, res) => {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

// DELETE
app.delete('/api/employees/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
    console.log(`Employee Management Server running at http://localhost:${PORT}`);
});
