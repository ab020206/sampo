const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/tasks.json');

// Helper to read data
const readData = () => {
    const data = fs.readFileSync(DATA_PATH);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// GET all tasks
router.get('/', (req, res) => {
    try {
        const tasks = readData();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST new task
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    try {
        const tasks = readData();
        const filteredTasks = tasks.filter(t => t.id != req.params.id);
        writeData(filteredTasks);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
