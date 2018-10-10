'use strict';




//require config.js module
const { PORT } = require('./config'); 
const express = require('express');

const data = require('./db/notes');

const morgan = require('morgan')
const notesRouter = require('./router/notes.router')

const app = express();

//require logger.js middleware
const requestLogger = morgan('dev');


// INSERT EXPRESS APP CODE HERE...

app.use([requestLogger, express.static('public'), express.json()]);

app.use('/api', notesRouter);


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
