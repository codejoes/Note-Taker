const express = require('express');
const path = require('path');
const {clog} = require('./middleware/clog')
const app = express();
const { v4: uuidv4 } = require('uuid');
const fs = require('./helpers/fsUtils')

const PORT = process.env.PORT || 5000;

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(clog);
app.use(express.static('public'));

//ROUTES

//Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//Notes Page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


//Get, Post, and Delete Note Routes

app.get('/api/notes', (req, res) => {
    fs.readFromFile('./db/db.json').then((data) => {
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        fs.readAndAppend(newNote, './db/db.json');
    }
});


app.delete('/api/notes/:id', (req, res) => {
    
    console.log(req.params.id);

    const noteId = req.params.id;
    
    fs.readFromFile('./db/db.json')
        .then((data) => {
            const notes = JSON.parse(data);
            const newNotes = notes.filter((note) => note.id !== noteId);
            res.json(fs.writeToFile('./db/db.json', newNotes));
        })
        
        
});

//404
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/404.html'));
});


//LISTEN
app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));