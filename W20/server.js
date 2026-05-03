const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/employeeDB');

// Employee Schema
const employeeSchema = new mongoose.Schema({
    name: String,
    position: String,
    salary: Number,
    email: String
});

const Employee = mongoose.model('Employee', employeeSchema);

// CRUD Operations

// CREATE
app.post('/employees', async (req, res) => {
    const emp = new Employee(req.body);
    await emp.save();
    res.status(201).send(emp);
});

// READ
app.get('/employees', async (req, res) => {
    const employees = await Employee.find();
    res.send(employees);
});

// UPDATE
app.put('/employees/:id', async (req, res) => {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(emp);
});

// DELETE
app.delete('/employees/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.send({ message: "Employee record removed." });
});

app.listen(3000, () => console.log('Employee CRUD API running on port 3000'));
