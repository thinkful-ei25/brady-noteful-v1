'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

const express = require('express');

const app = express();

// INSERT EXPRESS APP CODE HERE...

app.use(express.static('public'));

//GET NOTES LIST ENDPOINT
app.get('/api/notes', (req, res) => {
  res.json(data);
})

//GET INDIVIDUAL NOTE ENDPOINT

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  let requestedData = data.find(item => item.id === Number(id));
  res.json(requestedData);
})

app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
