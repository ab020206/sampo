const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/onlineBookstore')
    .then(() => console.log('Connected to bookstore DB'))
    .catch(err => console.error(err));

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    category: String
});

const Book = mongoose.model('Book', bookSchema);

// CRUD
app.get('/api/books', async (req, res) => {
    const books = await Book.find();
    res.send(books);
});

app.post('/api/books', async (req, res) => {
    const book = new Book(req.body);
    await book.save();
    res.send(book);
});

app.put('/api/books/:id', async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(book);
});

app.delete('/api/books/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.send({ message: 'Book deleted' });
});

const PORT = 3007;
app.listen(PORT, () => console.log(`W21 Bookstore server at http://localhost:${PORT}`));
