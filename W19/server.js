const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// a) Create Database called student
mongoose.connect('mongodb://localhost:27017/student')
    .then(() => console.log('Connected to student DB'))
    .catch(err => console.error(err));

// b) Create collection studentmarks
const studentSchema = new mongoose.Schema({
    Name: String,
    Roll_No: Number,
    WAD_Marks: Number,
    CC_Marks: Number,
    DSBDA_Marks: Number,
    CNS_Marks: Number,
    AI_marks: Number
});

const Student = mongoose.model('StudentMark', studentSchema);

// c) Insert array of documents
app.get('/api/students/seed', async (req, res) => {
    const data = [
        { Name: 'Amit', Roll_No: 1, WAD_Marks: 25, CC_Marks: 26, DSBDA_Marks: 22, CNS_Marks: 28, AI_marks: 30 },
        { Name: 'Sumit', Roll_No: 2, WAD_Marks: 18, CC_Marks: 20, DSBDA_Marks: 15, CNS_Marks: 22, AI_marks: 24 },
        { Name: 'Neha', Roll_No: 3, WAD_Marks: 28, CC_Marks: 29, DSBDA_Marks: 27, CNS_Marks: 29, AI_marks: 30 },
        { Name: 'Sanya', Roll_No: 4, WAD_Marks: 15, CC_Marks: 12, DSBDA_Marks: 21, CNS_Marks: 18, AI_marks: 20 },
        { Name: 'Rahul', Roll_No: 5, WAD_Marks: 35, CC_Marks: 38, DSBDA_Marks: 32, CNS_Marks: 42, AI_marks: 45 }
    ];
    await Student.deleteMany({});
    await Student.insertMany(data);
    res.send({ message: 'Student data seeded' });
});

// d) Total count and list all
app.get('/api/students/all', async (req, res) => {
    const students = await Student.find();
    const count = await Student.countDocuments();
    res.send({ count, students });
});

// e) >20 marks in DSBDA
app.get('/api/students/dsbda-gt-20', async (req, res) => {
    const students = await Student.find({ DSBDA_Marks: { $gt: 20 } });
    res.send(students);
});

// f) Update marks by 10 for specified students (increase all subject marks by 10 for a roll no)
app.put('/api/students/update-marks/:rollNo', async (req, res) => {
    const student = await Student.findOneAndUpdate(
        { Roll_No: req.params.rollNo },
        { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_marks: 10 } },
        { new: true }
    );
    res.send(student);
});

// g) >25 marks in all subjects
app.get('/api/students/all-gt-25', async (req, res) => {
    const students = await Student.find({
        WAD_Marks: { $gt: 25 },
        CC_Marks: { $gt: 25 },
        DSBDA_Marks: { $gt: 25 },
        CNS_Marks: { $gt: 25 },
        AI_marks: { $gt: 25 }
    });
    res.send(students);
});

// h) <40 in both Maths and Science (Here maps to DSBDA and CC for practical context)
app.get('/api/students/low-scorers', async (req, res) => {
    const students = await Student.find({
        DSBDA_Marks: { $lt: 40 },
        CC_Marks: { $lt: 40 }
    });
    res.send(students);
});

// i) Remove specified student
app.delete('/api/students/:rollNo', async (req, res) => {
    await Student.findOneAndDelete({ Roll_No: req.params.rollNo });
    res.send({ message: 'Student removed' });
});

const PORT = 3005;
app.listen(PORT, () => console.log(`W19 Student server at http://localhost:${PORT}`));
