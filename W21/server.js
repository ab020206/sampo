const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bookDB')
    .then(() => console.log("Connected to MongoDB (bookDB)"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Book Schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    category: String
});

const Book = mongoose.model('Book', bookSchema);

// CRUD Endpoints
app.get('/api/books', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

app.post('/api/books', async (req, res) => {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
});

app.put('/api/books/:id', async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
});

app.delete('/api/books/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Book Management System at http://localhost:${PORT}`));
