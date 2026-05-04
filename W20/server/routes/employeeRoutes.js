const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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

// GET all
router.get('/', async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
});

// POST add
router.post('/', async (req, res) => {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
});

// PUT update
router.put('/:id', async (req, res) => {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

module.exports = router;
