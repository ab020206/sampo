const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection (Localhost)
mongoose.connect('mongodb://localhost:27017/musicDB')
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Music Schema
const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    album: String,
    year: Number
});

const Song = mongoose.model('Song', songSchema);

// CREATE
app.post('/api/songs', async (req, res) => {
    const song = new Song(req.body);
    await song.save();
    res.send(song);
});

// READ (Query All)
app.get('/api/songs', async (req, res) => {
    const songs = await Song.find();
    res.send(songs);
});

// UPDATE
app.put('/api/songs/:id', async (req, res) => {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(song);
});

// DELETE
app.delete('/api/songs/:id', async (req, res) => {
    await Song.findByIdAndDelete(req.params.id);
    res.send({ message: "Song deleted" });
});

app.listen(3000, () => console.log('Music API running on port 3000'));
