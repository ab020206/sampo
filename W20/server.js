const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// View all
app.get('/api/employees', async (req, res) => {
    const employees = await Employee.find();
    res.send(employees);
});

// Add
app.post('/api/employees', async (req, res) => {
    const employee = new Employee(req.body);
    await employee.save();
    res.send(employee);
});

// Update
app.put('/api/employees/:id', async (req, res) => {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(employee);
});

// Delete
app.delete('/api/employees/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.send({ message: 'Employee deleted' });
});

const PORT = 3006;
app.listen(PORT, () => console.log(`W20 Employee server at http://localhost:${PORT}`));
