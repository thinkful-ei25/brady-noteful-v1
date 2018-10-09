'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);


//require config.js module
const { PORT } = require('./config'); 

console.log('Hello Noteful!');

const express = require('express');

const app = express();

//require logger.js middleware
const { requestLogger } = require('./middleware/logger');


// INSERT EXPRESS APP CODE HERE...

app.use([express.static('public'), requestLogger]);
//app.use(requestLogger);



//GET NOTES LIST ENDPOINT
app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if(err) {
      return next(err);
    }
    res.json(list);
  });
});

//GET INDIVIDUAL NOTE ENDPOINT

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;

  notes.find(id, (err, list) => {
    if(err) {
      return next(err);
    }
    res.json(list);
  });
});

//Error-handling

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({message: 'Not Found'});
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ 
    message: err.message,
    error: err
  });
});

//LISTEN

app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
