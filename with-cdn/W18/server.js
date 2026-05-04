const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// a) Create Database called music
mongoose.connect('mongodb://localhost:27017/music')
    .then(() => console.log('Connected to MongoDB (music database)'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// b) Create collection called song details
const songSchema = new mongoose.Schema({
    Songname: String,
    Film: String,
    Music_director: String,
    singer: String,
    Actor: String,
    Actress: String
});

const Song = mongoose.model('SongDetail', songSchema);

// c) Insert array of 5 songs
app.get('/api/music/seed', async (req, res) => {
    const songs = [
        { Songname: 'Shape of You', Film: 'Divide', Music_director: 'Ed Sheeran', singer: 'Ed Sheeran' },
        { Songname: 'Senorita', Film: 'Shawn Mendes', Music_director: 'Benny Blanco', singer: 'Shawn Mendes' },
        { Songname: 'Jai Ho', Film: 'Slumdog Millionaire', Music_director: 'A.R. Rahman', singer: 'Sukhwinder Singh' },
        { Songname: 'Tum Hi Ho', Film: 'Aashiqui 2', Music_director: 'Mithoon', singer: 'Arijit Singh' },
        { Songname: 'Kun Faya Kun', Film: 'Rockstar', Music_director: 'A.R. Rahman', singer: 'Mohit Chauhan' }
    ];
    await Song.deleteMany({});
    await Song.insertMany(songs);
    res.send({ message: '5 songs inserted successfully' });
});

// d) Total count and list all
app.get('/api/music/all', async (req, res) => {
    const songs = await Song.find();
    const count = await Song.countDocuments();
    res.send({ count, songs });
});

// e) List specified Music Director songs
app.get('/api/music/director/:name', async (req, res) => {
    const songs = await Song.find({ Music_director: req.params.name });
    res.send(songs);
});

// f) Music Director songs sung by specified Singer
app.get('/api/music/filter', async (req, res) => {
    const { director, singer } = req.query;
    const songs = await Song.find({ Music_director: director, singer: singer });
    res.send(songs);
});

// g) Delete song
app.delete('/api/music/:id', async (req, res) => {
    await Song.findByIdAndDelete(req.params.id);
    res.send({ message: 'Song deleted' });
});

// h) Add new favorite song
app.post('/api/music', async (req, res) => {
    const song = new Song(req.body);
    await song.save();
    res.send(song);
});

// i) List Songs by Singer from film
app.get('/api/music/singer-film', async (req, res) => {
    const { singer, film } = req.query;
    const songs = await Song.find({ singer, Film: film });
    res.send(songs);
});

// j) Update by adding Actor and Actress
app.put('/api/music/update-actors/:id', async (req, res) => {
    const { Actor, Actress } = req.body;
    const song = await Song.findByIdAndUpdate(req.params.id, { Actor, Actress }, { new: true });
    res.send(song);
});

const PORT = 3004;
app.listen(PORT, () => console.log(`W18 Music server at http://localhost:${PORT}`));
