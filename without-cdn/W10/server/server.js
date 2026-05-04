const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

const DATA_PATH = path.join(__dirname, '../data/tasks.json');

// Helper to read data
const readData = () => {
    if (!fs.existsSync(DATA_PATH)) return [];
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// API Routes (using app.get, app.post, etc. directly)

// GET all tasks
app.get('/api/tasks', (req, res) => {
    try {
        const tasks = readData();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST new task
app.post('/api/tasks', (req, res) => {
    try {
        const tasks = readData();
        const newTask = {
            id: Date.now(),
            text: req.body.text,
            completed: false
        };
        tasks.push(newTask);
        writeData(tasks);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
    try {
        const tasks = readData();
        const index = tasks.findIndex(t => t.id == req.params.id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...req.body };
            writeData(tasks);
            res.json(tasks[index]);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const tasks = readData();
        const filteredTasks = tasks.filter(t => t.id != req.params.id);
        writeData(filteredTasks);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.listen(PORT, () => {
    console.log(`To-Do Server running at http://localhost:${PORT}`);
});
