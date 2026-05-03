const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/studentDB');

const studentSchema = new mongoose.Schema({
    name: String,
    rollNo: Number,
    marks: {
        maths: Number,
        science: Number,
        english: Number
    }
});

const Student = mongoose.model('Student', studentSchema);

// INSERT Sample Data
app.post('/api/students/seed', async (req, res) => {
    await Student.insertMany([
        { name: "Rahul", rollNo: 101, marks: { maths: 85, science: 90, english: 78 } },
        { name: "Sanya", rollNo: 102, marks: { maths: 92, science: 88, english: 95 } }
    ]);
    res.send("Data seeded!");
});

// DISPLAY All Students
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.send(students);
});

// FILTER: Get students with Maths > 90
app.get('/api/students/maths-toppers', async (req, res) => {
    const students = await Student.find({ "marks.maths": { $gt: 90 } });
    res.send(students);
});

// UPDATE: Update marks for a student
app.put('/api/students/:rollNo', async (req, res) => {
    const student = await Student.findOneAndUpdate(
        { rollNo: req.params.rollNo }, 
        { "marks.science": req.body.science }, 
        { new: true }
    );
    res.send(student);
});

app.listen(3000, () => console.log('Student Marks API running on port 3000'));
