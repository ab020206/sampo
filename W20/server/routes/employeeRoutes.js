const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/employees.json');

const readData = () => JSON.parse(fs.readFileSync(DATA_PATH));
const writeData = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

// GET all
router.get('/', (req, res) => {
    res.json(readData());
});

// POST add
router.post('/', (req, res) => {
    const employees = readData();
    const newEmployee = { id: Date.now(), ...req.body };
    employees.push(newEmployee);
    writeData(employees);
    res.status(201).json(newEmployee);
});

// PUT update
router.put('/:id', (req, res) => {
    const employees = readData();
    const index = employees.findIndex(e => e.id == req.params.id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...req.body };
        writeData(employees);
        res.json(employees[index]);
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

// DELETE
router.delete('/:id', (req, res) => {
    const employees = readData();
    const filtered = employees.filter(e => e.id != req.params.id);
    writeData(filtered);
    res.json({ message: 'Deleted' });
});

module.exports = router;
