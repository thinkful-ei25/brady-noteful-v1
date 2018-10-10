'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);


//require config.js module
const { PORT } = require('./config'); 



const express = require('express');

const morgan = require('morgan')

const app = express();

//require logger.js middleware
const requestLogger = morgan('dev');


// INSERT EXPRESS APP CODE HERE...

app.use([requestLogger, express.static('public'), express.json()]);
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

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if(err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
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
