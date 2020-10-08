const express = require('express');
const app = express();
const port = 3002;
const Pokemon = require('./models/pokemon.js');

app.set('view engine', 'ejs')

app.use(express.static('public'))

// INDEX
app.get('/', (req, res) => {
    res.render('index.ejs', { pageTitle: "Pokedex Main", data: Pokemon });
});

// SHOW
app.get('/:id', (req, res) => {
    res.render('show.ejs', { data: Pokemon[req.params.id] });
});

//NEW
app.get('/pokemon/new', (req, res) => {
    res.render('show.ejs', {});
});

//EDIT
app.get('/pokemon/edit', (req, res) => {
    res.render('show.ejs', { data: Pokemon[req.params.id] });
});




app.listen(port, (req, res) => { console.log(`Pokedex app listening on port ${port}`) })